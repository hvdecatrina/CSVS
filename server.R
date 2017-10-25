library(shiny)
shinyServer(function(input, output, session){
  values <- reactiveValues()
  updateSelectInput(session, "dateSet", choices = dateList)
  
  dataOfTime <- reactive({
    data <- NULL
    if(!is.null(input$dateSet)){
      data <- newAllData[newAllData$SAMPLETIME == input$dateSet,]
    }
    return(data)
  })
  
  pListData <- reactive({
    dataOfAll <- dataOfTime()
    pAreaList <- NULL
    if(!is.null(dataOfAll)){
      pArea <-dataOfAll[!duplicated(dataOfAll$SAMPLEPROVINCE),c(3,24)]
      pAreaList <- pArea$pCode
      names(pAreaList) <- pArea$SAMPLEPROVINCE
      pAreaList <- c("全国" = -1, pAreaList)
    }
    return(pAreaList)
  })
  
  observe({
    choices <- pListData()
    updateSelectInput(session, "pArea", choices = choices)
  })

  qListData <- reactive({
    data <- dataOfTime()
    qList <- NULL
    if(!is.null(input$pArea)) {
      if(input$pArea != "-1"){
        qData <- data[grep(paste("^",input$pArea,sep=""),data$qCode),c(5,25)]
        qCODE <- qData$qCode
        qList <- qData[!duplicated(qCODE),]$qCode
        names(qList) <- qData[!duplicated(qCODE),]$SAMPLEPREFECTURE
        qList <- c("全省" = -1, qList)
      }else{
        qList <- c("")
      }
    }
    return(qList)
  })

  cListData <- reactive({
    data <- dataOfTime()
    cList <- NULL
    if(!is.null(input$pArea)){
      if(input$pArea != "-1"){
        if(!is.null(input$qArea)){
          if(input$qArea != "-1"){
            cData <- data[grep(paste("^",input$qArea,sep=""),data$cCode),c(6,26)]
            cCODE <- cData$cCode
            cList <- cData[!duplicated(cCODE),]$cCode
            names(cList) <- cData[!duplicated(cCODE),]$SAMPLECOUNTY
            cList <- c("全市" = -1, cList)
          }else{
            cList <- c("")
          }
        }
      }else{
        cList <- c("")
      }
    }
    return(cList)
  })

  observe({
    choices <- qListData()
    updateSelectInput(session, "qArea", choices = choices)
  })

  observe({
    choices <- cListData()
    updateSelectInput(session, "cArea", choices = choices)
  })
  
  siteList <- reactive({
    if(!is.null(dataOfTime())){
      dataone <- dataOfTime()
      dataList <- dataone[!duplicated(dataone$keyId),]
      if(!is.null(input$pArea)){
        if(input$pArea == "-1"){
          return(dataList)
        }else{
          pcode <- input$pArea
          if(!is.null(input$qArea)){
            if(input$qArea == "-1"){
              data <- subset(dataList,pCode == pcode)
              return(data)
            }else{
              qcode <- input$qArea
              if(!is.null(input$cArea)){
                if(input$cArea == "-1"){
                  data <- subset(dataList,qCode == qcode)
                  return(data)
                }else{
                  ccode <- input$cArea
                  data <- subset(dataList,cCode == ccode)
                  return(data)
                }
              }
            }
          }
        }
      }
    }
  })
  selectedSites <- reactive({
    selSites <- input$selectedSites
    return(selSites)
  })
  observe({
    if(!is.null(siteList())) {
      keys <- siteList()$key
    } else {
      keys <- list()
    }
    session$sendCustomMessage(type = "updateVisibleMonitors", keys)
  })
  keyAllJsonF <- reactive({
    if(!is.null(input$dateSet)){
      timeData <- subset(sampleData,SAMPLETIME == input$dateSet)
      timeData <- droplevels(timeData)
      if(!is.null(input$clickey)){
        keyData <- subset(timeData,key == input$clickey)
        keyData <- droplevels(keyData)
      }else{
        keyData <- data.frame()
      }
      return(keyData)
    }
  })
  observe({
    keyAllJson <- keyAllJsonF()
    if(!is.null(keyAllJson)){
      sampleJsonGroup <- split(keyAllJson,keyAllJson$sampleOnlyId)
      sampleJsonData <- sapply(sampleJsonGroup,function(r){
        oo <- as.data.frame(r,stringsAsFactors = FALSE)
        ll <- lapply(oo,as.character)
        kk <- sapply(seq(length(ll)),function(r){
          nameR <- names(ll[r])
          boolStr <- nameR == "DETECTIONITEM" | nameR == "BELONGTO" | nameR == "TOXICITY" | nameR == "DETECTIONRESULTS" | nameR == "BELONGTO" | nameR == "JUDGMENT_CN" | nameR == "JUDGMENT_EUR" | nameR == "JUDGMENT_JPN" | nameR == "JUDGMENT_USA" | nameR == "JUDGMENT_HK" | nameR == "JUDGMENT_CAC"
          if(boolStr){
            rArray <- jsonArray(ll[[r]],quote = TRUE)
          }else{
            rArray <- jsonArray(ll[[r]][1],quote = TRUE)
          }
          names(rArray) <- nameR
          return(rArray)
        })
        return(jsonObject(kk))
      })
      dataJson <- jsonArray(sampleJsonData)
      session$sendCustomMessage(type = "updateDataJson", dataJson)
    }
  })
  observe({
    selData <- selectedSites()
    if(!is.null(selData)){
      pos <- as.character(unique(sampleData[sampleData$key == selData,1])) 
      session$sendCustomMessage(type = "updatapos", pos)
    }
  })
  observe({
    keyAllJson <- keyAllJsonF()
    if(!is.null(keyAllJson)){
      if(is.null(input$clickey) && !is.null(input$categorySelect)){
        protype <- 1
      }else if(!is.null(input$clickey) && !is.null(input$categorySelect)){
        categoryData <- subset(keyAllJson,CATEGORY == input$categorySelect)
        categoryData <- droplevels(categoryData)
        if(nrow(categoryData) == 0){
          protype <- 0
        }else{
          category <- unique(categoryData$SAMPLECATEGORY)
          cc <- sapply(seq(length(category)),function(r){
            qq <- subset(categoryData,SAMPLECATEGORY == category[r])
            num <- length(unique(qq$sampleOnlyId))
            value <- jsonObject(list(value = num,name = as.character(category[r])))
            return(value)
          })
          protype <- jsonArray(cc)
        }
      }else{
        protype <- 2
      }
      session$sendCustomMessage(type = "updateCategory", protype)
    }
  })
})
