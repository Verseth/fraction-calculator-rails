lastFormula = ''
syntaxError = false
divisionError = false
validChars = ' 0123456789.-+/:÷*^()'
restOfTheFormula = ''
extraChars = 0
formulaCounter = 0
freshAfterResult = false

function charIsAnOperator(char) {
    switch(char) {
        case '*':
        case ':':
        case '÷':
        case '+':
        case '-':
        case '^':
            return true
        default:
            return false
    }
}

function charIsADigit(char) {
    switch(char) {
        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
            return true
        default:
            return false
    }
}

function setCaretPosition(elemId, caretPos) {
    var elem = document.getElementById(elemId);

    if(elem != null) {
        if(elem.createTextRange) {
            var range = elem.createTextRange();
            range.move('character', caretPos);
            range.select();
        }
        else {
            if(elem.selectionStart) {
                elem.focus();
                elem.setSelectionRange(caretPos, caretPos);
            }
            else
                elem.focus();
        }
    }
}

// this function lets users be more careless with the way they input
// the calculation formula by filling in the neccessary characters
// to make sure syntax is viable along the way

// returns true when `char` can be added to the formula
function fixTheFormula(char, caretAt, onlyCheck=false) {
    var newVal = $('#display').val()
    extraChars = 0

    if(caretAt != undefined){
        restOfTheFormula = newVal.substring(caretAt)
        newVal = newVal.substring(0, caretAt)
    }

    trimmed = newVal.trim()
    // if(trimmed.length > 0) {
    //     for(i = newVal.length-1; i >= 0; i--){
    //         if(newVal[i] == trimmed[trimmed.length-1]) {
    //             extraChars -= newVal.length-1 - i
    //         }
    //     }
    // }
    newTrim = trimmed.substring(0, trimmed.length - 1).trim()
    lastChar = trimmed[trimmed.length-1]
    secondToLastChar = newTrim[newTrim.length-1]
    if(charIsAnOperator(char)) {
        if((char == '-' && trimmed.length == 0)){
            trimmed += '('
            extraChars += 1
            newVal = trimmed
        }
        else if(lastChar == ')'){
            trimmed += ' '
            extraChars += 1
            newVal = trimmed
        }
        else if(char == '-' && charIsADigit(lastChar)){
            trimmed += ') '
            extraChars += 2
            newVal = trimmed
        }
        else if(char == '-' && charIsAnOperator(lastChar) && secondToLastChar == ')') {
            trimmed += ' ('
            extraChars += 2
            newVal = trimmed
        }
        else if(char == '-' && lastChar == '-'){
            return false
        }
        else if(char == '-'){}
        else if(charIsAnOperator(lastChar) || trimmed.length == 0){
            return false
        } 
        else if(trimmed.length > 0 && charIsADigit(lastChar)) { 
            trimmed += ') '
            extraChars += 2
            newVal = trimmed
        }
        restOfTheFormula = restOfTheFormula.trim()
        if(restOfTheFormula.length > 0) {
            if(charIsADigit(restOfTheFormula[0])){
                restOfTheFormula = ' (' + restOfTheFormula
                extraChars += 2
            }
        }
    } 
    else if(charIsADigit(char)) {
        if(freshAfterResult && caretAt == undefined){
            freshAfterResult = false
            trimmed = ''
            newTrim = ''
            newVal = ''
            lastChar = ''
            secondToLastChar = ''
        }

        if(trimmed.length == 0) { 
            trimmed += '('
            extraChars += 1
            newVal = trimmed
        }
        else if(lastChar == ')'){
            return false
        }
        else if(lastChar == '-' && secondToLastChar == ')') {
            trimmed += ' ('
            extraChars += 2
            newVal = trimmed
        }
        else if(charIsAnOperator(lastChar) && lastChar != '-') {
            trimmed += ' ('
            extraChars += 2
            newVal = trimmed
        }
        else if(lastChar == '/' && secondToLastChar == ')') {
            newTrim += ' / ('
            extraChars += 4
            newVal = newTrim
        }
    }
    else if(char == '/'){
        if(!charIsADigit(lastChar) && lastChar != ')') {
            return false
        }
    }
    else if(char == '(' && charIsAnOperator(lastChar)) {
        trimmed += ' '
        extraChars += 1
        newVal = trimmed
    }
    else if(char == '.') {
        if(trimmed.length == 0 || lastChar == '.' ||
           lastChar == '/' || lastChar == '(' ||
           lastChar == ')' || charIsAnOperator(lastChar)) {
            return false
        }
        newVal = trimmed
    }

    if(!onlyCheck)
        $('#display').val(newVal)
    return true
}

function appendCharToFormula(char) {
    restOfTheFormula = ''
    if(!fixTheFormula(char)) return false
    var newVal = $('#display').val()
    newVal += char
    destroyLastFormula()
    $('#display').val(newVal)
    $('#display').focus()
}

function enterTheRest() {
    var newVal = $('#display').val()
    $('#display').val(newVal + restOfTheFormula)
    restOfTheFormula = ''
}

function isAControlKey(key) {
    if(key == 'ArrowRight' || key == 'Backspace' || key == 'ArrowLeft' ||
       key == 'ArrowUp' || key == 'ArrowDown' || key == 'Control' ||
       key == 'Shift' ||key == 'Meta' || key == 'F5' || key == 'Alt' || key == 'Delete')
        return true
    else return false
}

function destroyLastFormula() {
    $('#last-formula-label').text('')
    lastFormula = ''
    freshAfterResult = false
}

function inputControl() {
    var e = event || window.event
    var key = e.key
    var altKey = key
    var caretAt = e.target.selectionStart
    var selEnd = e.target.selectionEnd

    if(key == 'Enter'){
        evaluate()
        return true
    }

    if((e.metaKey || e.ctrlKey) && (key == 'c' || key == 'v' || key == 'a' || key == 'x') || isAControlKey(key)) {
        if(key == 'v' || key == 'x' || key == 'Backspace' || key == 'Delete') destroyLastFormula()
        return true
    }

    // text is selected
    if(caretAt != selEnd){
        formula = $('#display').val()

        firstPart = formula.substring(0, caretAt)
        lastPart = formula.substring(selEnd)
        if(fixTheFormula(key, caretAt, true))
            formula = $('#display').val(firstPart + lastPart)
        else {
            if (e.preventDefault) e.preventDefault() //normal browsers
            e.returnValue = false //IE
            return false
        }
    }

    if(key == ':' || key == '?') {
        if (e.preventDefault) e.preventDefault() //normal browsers
        e.returnValue = false //IE

        altKey = '÷'

        if(fixTheFormula(altKey, caretAt, true)){
            fixTheFormula(altKey, caretAt)
            formula = $('#display').val()
            $('#display').val(formula + '÷')
            enterTheRest()
            setCaretPosition('display', caretAt + 1 + extraChars)
            destroyLastFormula()
        }
        else return false

        return true
    }

    for(i = 0; i < validChars.length; i++)
        if(key == validChars[i]) {
            if(fixTheFormula(key, caretAt)){
                setTimeout(enterTheRest, 0)
                setTimeout(function() {
                    setCaretPosition('display', caretAt + 1 + extraChars)
                }, 0)
                destroyLastFormula()
                return true
            }
        }

    if (e.preventDefault) e.preventDefault() //normal browsers
    e.returnValue = false //IE
    return false
}

function setLastFormula(response) {
    $('#history-btn').show()
    $('#no-history-btn').hide()
    lastFormula = response.formula
    formatted = lastFormula + '='
    result = '=' + response.result.common
    newFormulaLi = '<li id="formula-'+ formulaCounter +'"" class="list-group-item history-formula">'+ formatted +'</li>'
    newResultLi = '<li id="result-'+ formulaCounter +'" class="list-group-item history-result">'+ result +'</li>'

    $("#history-list").prepend(newResultLi)
    $("#history-list").prepend(newFormulaLi)
    
    formulaCounter++
    $('#last-formula-label').attr('title', formatted)
    if(formatted.length > 44) {
        formatted = formatted.substring(formatted.length - 41)
        formatted = '...' + formatted
    }
    $('#last-formula-label').text(formatted)
    freshAfterResult = true
}

function evaluate() {
    let formula = $('#display').val()
    if(formula != lastFormula) {
        if(formula.length > 0 && charIsADigit(formula[formula.length-1]))
            formula += ')'
        let xhr = new window.XMLHttpRequest()
        let formData = new window.FormData()
        formData.append('formula', formula)
        xhr.open('POST', '/api/evaluate', true)
        xhr.onload = (event) => {
            if (xhr.status === 200) {
                $('#syntax').addClass('d-none')
                let response = JSON.parse(event.target.response)
                setLastFormula(response)
                let result = response.result
                $('#display').val(result.common)
                syntaxError = false
                divisionError = false
            } else if (xhr.status == 201) {
                $('#division').removeClass('d-none')
                $('#display').val(formula)
                lastFormula = formula
                syntaxError = false
                divisionError = true
            } else {
                $('#syntax').removeClass('d-none')
                $('#display').val(formula)
                lastFormula = formula
                divisionError = false
                syntaxError = true
            }
        }
        xhr.send(formData)
    } else {
        if(syntaxError) $('#syntax').removeClass('d-none')
        if(divisionError) $('#division').removeClass('d-none')
    }
}

function backspace() {
    let oldVal = $('#display').val()
    destroyLastFormula()
    $('#display').val(oldVal.slice(0, -1))
    $('#display').focus()
}

function clearCalc() {
    $('#display').val('')
    lastFormula = ''
    destroyLastFormula()
    syntaxError = false
    divisionError = false
    $('#history-btn').hide()
    $('#no-history-btn').show()

    $('#history-modal-center .history-formula').remove()
    $('#history-modal-center .history-result').remove()
}

function handleCalculatorClick(type, char) {
    if(type == 'function'){
        switch(char) {
            case 'ce':
                $('#error-label span').addClass('d-none')
                clearCalc()
                break
            case 'backspace':
                $('#error-label span').addClass('d-none')
                backspace()
                break
            case '=':
                evaluate()
                break
        }
    } else {
        $('#error-label span').addClass('d-none')
        appendCharToFormula(char)
    }
}

function addProgressCursor() {
    $('main').addClass('progress-cursor')
}

function removeProgressCursor() {
    $('main').removeClass('progress-cursor')
}

function properCalcExpanding() {
    $('#left-panel').addClass('offset-md-3')
    $('#left-panel .calculator').removeClass('width-270')
    $('#expander').hide('slow')
    $('#shrinker').show('slow')
}

function properCalcShrinking() {
    $('#right-panel').show('fast')
}

function expandCalc() {
    addProgressCursor()
    $('#right-panel').hide('fast')
    setTimeout(properCalcExpanding, 500)
    setTimeout(removeProgressCursor, 1200)
}

function shrinkCalc() {
    addProgressCursor()
    $('#left-panel').removeClass('offset-md-3')
    $('#left-panel .calculator').addClass('width-270')
    $('#expander').show('slow')
    $('#shrinker').hide('slow')
    setTimeout(properCalcShrinking, 1100)
    setTimeout(removeProgressCursor, 1200)
}


$(document).ready( () => {
    $("#try-it").click(function() {
        $([document.documentElement, document.body]).animate({
            scrollTop: $("#reveal-main").offset().top
        }, 1500)
    })

    $(document).on('click', '#expander', function() { expandCalc() })
    $(document).on('click', '#shrinker', function() { shrinkCalc() })

    $(document).on('click', '#ce-btn', function() { handleCalculatorClick('function', 'ce') })
    $(document).on('click', '#slash-btn', function() { handleCalculatorClick('symbol', '/') })
    $(document).on('click', '#backspace-btn', function() { handleCalculatorClick('function', 'backspace') })

    $(document).on('click', '#left-bracket-btn', function() { handleCalculatorClick('symbol', '(') })
    $(document).on('click', '#right-bracket-btn', function() { handleCalculatorClick('symbol', ')') })
    $(document).on('click', '#power-btn', function() { handleCalculatorClick('symbol', '^') })
    $(document).on('click', '#divide-btn', function() { handleCalculatorClick('symbol', '÷') })

    $(document).on('click', '#seven-btn', function() { handleCalculatorClick('symbol', '7') })
    $(document).on('click', '#eight-btn', function() { handleCalculatorClick('symbol', '8') })
    $(document).on('click', '#nine-btn', function() { handleCalculatorClick('symbol', '9') })
    $(document).on('click', '#multiply-btn', function() { handleCalculatorClick('symbol', '*') })

    $(document).on('click', '#four-btn', function() { handleCalculatorClick('symbol', '4') })
    $(document).on('click', '#five-btn', function() { handleCalculatorClick('symbol', '5') })
    $(document).on('click', '#six-btn', function() { handleCalculatorClick('symbol', '6') })
    $(document).on('click', '#substract-btn', function() { handleCalculatorClick('symbol', '-') })

    $(document).on('click', '#one-btn', function() { handleCalculatorClick('symbol', '1') })
    $(document).on('click', '#two-btn', function() { handleCalculatorClick('symbol', '2') })
    $(document).on('click', '#three-btn', function() { handleCalculatorClick('symbol', '3') })
    $(document).on('click', '#add-btn', function() { handleCalculatorClick('symbol', '+') })

    $(document).on('click', '#decimal-separator-btn', function() { handleCalculatorClick('symbol', '.') })
    $(document).on('click', '#zero-btn', function() { handleCalculatorClick('symbol', '0') })
    $(document).on('click', '#space-btn', function() { handleCalculatorClick('symbol', ' ') })
    $(document).on('click', '#result-btn', function() { handleCalculatorClick('function', '=') })
})