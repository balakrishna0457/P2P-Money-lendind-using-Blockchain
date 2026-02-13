// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title P2PLending
 * @dev Peer-to-peer lending platform with multiple collateral types
 */
contract P2PLending {
    
    enum CollateralType { OwnETH, FriendETH, Physical }
    enum LoanStatus { Pending, Active, Completed, Defaulted, Cancelled }
    
    struct Loan {
        uint256 loanId;
        address borrower;
        address lender;
        uint256 amount;
        uint256 interestRate; // in basis points (e.g., 500 = 5%)
        uint256 duration; // in days
        uint256 installmentAmount;
        uint256 totalInstallments;
        uint256 paidInstallments;
        uint256 startTime;
        uint256 nextPaymentDue;
        CollateralType collateralType;
        address friendWallet; // for FriendETH type
        string physicalContacts; // for Physical type
        LoanStatus status;
        bool collateralLocked;
    }
    
    struct Installment {
        uint256 amount;
        uint256 dueDate;
        uint256 paidDate;
        bool isPaid;
    }
    
    // State variables
    uint256 public loanCounter;
    mapping(uint256 => Loan) public loans;
    mapping(uint256 => mapping(uint256 => Installment)) public installments;
    mapping(address => uint256[]) public borrowerLoans;
    mapping(address => uint256[]) public lenderLoans;
    mapping(address => bool) public defaulters;
    mapping(address => uint256) public creditScores;
    
    // Events
    event LoanCreated(uint256 indexed loanId, address indexed borrower, uint256 amount, CollateralType collateralType);
    event LoanAccepted(uint256 indexed loanId, address indexed lender);
    event CollateralLocked(uint256 indexed loanId, address indexed provider, uint256 amount);
    event InstallmentPaid(uint256 indexed loanId, uint256 installmentNumber, uint256 amount);
    event LoanCompleted(uint256 indexed loanId);
    event LoanDefaulted(uint256 indexed loanId, address indexed borrower);
    event CollateralReleased(uint256 indexed loanId, address indexed recipient);
    
    // Modifiers
    modifier onlyBorrower(uint256 _loanId) {
        require(loans[_loanId].borrower == msg.sender, "Only borrower can call this");
        _;
    }
    
    modifier onlyLender(uint256 _loanId) {
        require(loans[_loanId].lender == msg.sender, "Only lender can call this");
        _;
    }
    
    modifier loanExists(uint256 _loanId) {
        require(_loanId < loanCounter, "Loan does not exist");
        _;
    }
    
    /**
     * @dev Create a new loan request
     */
    function createLoan(
        uint256 _amount,
        uint256 _interestRate,
        uint256 _duration,
        uint256 _totalInstallments,
        CollateralType _collateralType,
        address _friendWallet,
        string memory _physicalContacts
    ) external payable returns (uint256) {
        require(_amount > 0, "Amount must be greater than 0");
        require(_duration > 0, "Duration must be greater than 0");
        require(_totalInstallments > 0, "Installments must be greater than 0");
        
        // For OwnETH type, borrower must lock collateral
        if (_collateralType == CollateralType.OwnETH) {
            require(msg.value >= _amount, "Insufficient collateral");
        }
        
        // For FriendETH type, friend wallet must be valid
        if (_collateralType == CollateralType.FriendETH) {
            require(_friendWallet != address(0), "Friend wallet required");
            require(_friendWallet != msg.sender, "Friend cannot be borrower");
        }
        
        // For Physical type, contacts must be provided
        if (_collateralType == CollateralType.Physical) {
            require(bytes(_physicalContacts).length > 0, "Physical contacts required");
        }
        
        uint256 totalRepayment = _amount + (_amount * _interestRate / 10000);
        uint256 installmentAmount = totalRepayment / _totalInstallments;
        
        uint256 loanId = loanCounter++;
        
        loans[loanId] = Loan({
            loanId: loanId,
            borrower: msg.sender,
            lender: address(0),
            amount: _amount,
            interestRate: _interestRate,
            duration: _duration,
            installmentAmount: installmentAmount,
            totalInstallments: _totalInstallments,
            paidInstallments: 0,
            startTime: 0,
            nextPaymentDue: 0,
            collateralType: _collateralType,
            friendWallet: _friendWallet,
            physicalContacts: _physicalContacts,
            status: LoanStatus.Pending,
            collateralLocked: _collateralType == CollateralType.OwnETH
        });
        
        borrowerLoans[msg.sender].push(loanId);
        
        if (_collateralType == CollateralType.OwnETH) {
            emit CollateralLocked(loanId, msg.sender, msg.value);
        }
        
        emit LoanCreated(loanId, msg.sender, _amount, _collateralType);
        
        return loanId;
    }
    
    /**
     * @dev Lender accepts loan and provides funds
     */
    function acceptLoan(uint256 _loanId) external payable loanExists(_loanId) {
        Loan storage loan = loans[_loanId];
        require(loan.status == LoanStatus.Pending, "Loan not available");
        require(msg.value >= loan.amount, "Insufficient funds");
        require(msg.sender != loan.borrower, "Cannot lend to yourself");
        
        loan.lender = msg.sender;
        loan.status = LoanStatus.Active;
        loan.startTime = block.timestamp;
        loan.nextPaymentDue = block.timestamp + (loan.duration * 1 days / loan.totalInstallments);
        
        lenderLoans[msg.sender].push(_loanId);
        
        // Create installment schedule
        uint256 installmentInterval = loan.duration * 1 days / loan.totalInstallments;
        for (uint256 i = 0; i < loan.totalInstallments; i++) {
            installments[_loanId][i] = Installment({
                amount: loan.installmentAmount,
                dueDate: loan.startTime + (installmentInterval * (i + 1)),
                paidDate: 0,
                isPaid: false
            });
        }
        
        // Transfer funds to borrower
        payable(loan.borrower).transfer(loan.amount);
        
        emit LoanAccepted(_loanId, msg.sender);
    }
    
    /**
     * @dev Friend locks collateral for borrower
     */
    function lockFriendCollateral(uint256 _loanId) external payable loanExists(_loanId) {
        Loan storage loan = loans[_loanId];
        require(loan.collateralType == CollateralType.FriendETH, "Not a friend collateral loan");
        require(msg.sender == loan.friendWallet, "Only designated friend can lock collateral");
        require(!loan.collateralLocked, "Collateral already locked");
        require(msg.value >= loan.amount, "Insufficient collateral");
        
        loan.collateralLocked = true;
        
        emit CollateralLocked(_loanId, msg.sender, msg.value);
    }
    
    /**
     * @dev Pay monthly installment
     */
    function payInstallment(uint256 _loanId) external payable loanExists(_loanId) onlyBorrower(_loanId) {
        Loan storage loan = loans[_loanId];
        require(loan.status == LoanStatus.Active, "Loan not active");
        require(loan.paidInstallments < loan.totalInstallments, "All installments paid");
        require(msg.value >= loan.installmentAmount, "Insufficient payment");
        
        uint256 installmentNumber = loan.paidInstallments;
        Installment storage installment = installments[_loanId][installmentNumber];
        
        require(!installment.isPaid, "Installment already paid");
        
        installment.isPaid = true;
        installment.paidDate = block.timestamp;
        loan.paidInstallments++;
        
        // Transfer to lender
        payable(loan.lender).transfer(loan.installmentAmount);
        
        // Update next payment due
        if (loan.paidInstallments < loan.totalInstallments) {
            loan.nextPaymentDue = installments[_loanId][loan.paidInstallments].dueDate;
        }
        
        emit InstallmentPaid(_loanId, installmentNumber, loan.installmentAmount);
        
        // Check if loan is completed
        if (loan.paidInstallments == loan.totalInstallments) {
            completeLoan(_loanId);
        }
    }
    
    /**
     * @dev Complete loan and release collateral
     */
    function completeLoan(uint256 _loanId) internal {
        Loan storage loan = loans[_loanId];
        loan.status = LoanStatus.Completed;
        
        // Release collateral back to provider
        if (loan.collateralLocked) {
            if (loan.collateralType == CollateralType.OwnETH) {
                payable(loan.borrower).transfer(loan.amount);
                emit CollateralReleased(_loanId, loan.borrower);
            } else if (loan.collateralType == CollateralType.FriendETH) {
                payable(loan.friendWallet).transfer(loan.amount);
                emit CollateralReleased(_loanId, loan.friendWallet);
            }
        }
        
        // Update credit score
        creditScores[loan.borrower] += 10;
        
        emit LoanCompleted(_loanId);
    }
    
    /**
     * @dev Mark loan as defaulted (can be called by lender after grace period)
     */
    function markAsDefault(uint256 _loanId) external loanExists(_loanId) onlyLender(_loanId) {
        Loan storage loan = loans[_loanId];
        require(loan.status == LoanStatus.Active, "Loan not active");
        require(block.timestamp > loan.nextPaymentDue + 7 days, "Grace period not over");
        
        loan.status = LoanStatus.Defaulted;
        defaulters[loan.borrower] = true;
        
        // Transfer collateral to lender if available
        if (loan.collateralLocked) {
            uint256 remainingAmount = loan.amount * (loan.totalInstallments - loan.paidInstallments) / loan.totalInstallments;
            payable(loan.lender).transfer(remainingAmount);
            emit CollateralReleased(_loanId, loan.lender);
        }
        
        // Decrease credit score
        if (creditScores[loan.borrower] > 50) {
            creditScores[loan.borrower] -= 50;
        } else {
            creditScores[loan.borrower] = 0;
        }
        
        emit LoanDefaulted(_loanId, loan.borrower);
    }
    
    /**
     * @dev Cancel pending loan request
     */
    function cancelLoan(uint256 _loanId) external loanExists(_loanId) onlyBorrower(_loanId) {
        Loan storage loan = loans[_loanId];
        require(loan.status == LoanStatus.Pending, "Can only cancel pending loans");
        
        loan.status = LoanStatus.Cancelled;
        
        // Return collateral if locked
        if (loan.collateralLocked && loan.collateralType == CollateralType.OwnETH) {
            payable(loan.borrower).transfer(loan.amount);
        }
    }
    
    /**
     * @dev Get loan details
     */
    function getLoan(uint256 _loanId) external view loanExists(_loanId) returns (Loan memory) {
        return loans[_loanId];
    }
    
    /**
     * @dev Get installment details
     */
    function getInstallment(uint256 _loanId, uint256 _installmentNumber) external view returns (Installment memory) {
        return installments[_loanId][_installmentNumber];
    }
    
    /**
     * @dev Get borrower's loans
     */
    function getBorrowerLoans(address _borrower) external view returns (uint256[] memory) {
        return borrowerLoans[_borrower];
    }
    
    /**
     * @dev Get lender's loans
     */
    function getLenderLoans(address _lender) external view returns (uint256[] memory) {
        return lenderLoans[_lender];
    }
    
    /**
     * @dev Check if address is defaulter
     */
    function isDefaulter(address _user) external view returns (bool) {
        return defaulters[_user];
    }
    
    /**
     * @dev Get credit score
     */
    function getCreditScore(address _user) external view returns (uint256) {
        return creditScores[_user];
    }
}
