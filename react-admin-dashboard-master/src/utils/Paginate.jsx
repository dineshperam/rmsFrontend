export const paginate = (items, currentPage, pageSize) => {
    const startIndex = (currentPage - 1) * pageSize;
    return items.slice(startIndex, startIndex + pageSize);
  };
  
  export const getPageNumbers = (totalItems, currentPage, pageSize) => {
    const totalPages = Math.ceil(totalItems / pageSize);
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);
  
    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
    }
  
    return { startPage, endPage, totalPages };
  };
  