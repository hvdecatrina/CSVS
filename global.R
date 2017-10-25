newAllData <- read.csv(file="data/filter/newAllData5.csv")
dateList <- as.numeric(as.character(newAllData$SAMPLETIME[!duplicated(newAllData$SAMPLETIME)]))
dateList <- dateList[order(dateList,decreasing=TRUE)]
sampleData <- read.csv(file="data/group/groupData.csv")
jsonArray <- function(a, quote = FALSE) {
  if(quote) {
    op <- paste0('["', paste0(a, collapse = '", "'), '"]')
  } else {
    op <- paste0("[", paste0(a, collapse = ", "), "]")      
  }
  return(op)
}
jsonObject <- function(o) {
  
  n <- paste0('"', names(o), '"')
  p <- sapply(o, function(x) {
    if((substr(x, 1, 1) == "[" & substr(x, nchar(x), nchar(x)) == "]") |
       (substr(x, 1, 1) == "{" & substr(x, nchar(x), nchar(x)) == "}")) {
      op <- x
    } else {
      op <- paste0('"', x, '"')
    }
    return(op)
  })
  paste0("{", paste(n, p, sep = ": ", collapse = ", "), "}")
  
}
