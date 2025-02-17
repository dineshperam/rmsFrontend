export const sortTransactions = (transactions, field, order) => {
    return [...transactions].sort((a, b) => {
      if (order === "asc") {
        return a[field] > b[field] ? 1 : -1;
      } else {
        return a[field] < b[field] ? 1 : -1;
      }
    });
  };
  
  export const filterByField = (transactions, field, searchValue) => {
    if (!searchValue) return transactions;
    return transactions.filter((transaction) =>
      transaction[field].toString().toLowerCase().includes(searchValue.toLowerCase())
    );
  };
  
  // New function to filter by multiple fields (Transaction ID, Receiver ID, Date)
  export const filterTransactions = (transactions, searchTerm, receiverSearch, dateSearch) => {
    return transactions.filter((transaction) => {
      const matchesTransactionId = searchTerm
        ? transaction.transactionId.toString().toLowerCase().includes(searchTerm.toLowerCase())
        : true;
  
      const matchesReceiverId = receiverSearch
        ? transaction.receiver.toString().toLowerCase().includes(receiverSearch.toLowerCase())
        : true;
  
      const matchesDate = dateSearch
        ? new Date(transaction.transactionDate).toLocaleDateString().includes(dateSearch)
        : true;
  
      return matchesTransactionId && matchesReceiverId && matchesDate;
    });
  };
  