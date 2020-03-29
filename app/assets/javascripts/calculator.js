var oldFormula = ''
var error = false

function charIsAnOperator(char) {
    switch(char) {
        case '*':
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

function appendCharToFormula(char){
    var newVal = $('#display').val()
    if(charIsAnOperator(char)) {
        trimmed = newVal.trim()
        if(char == '-' && trimmed.length == 0){
            trimmed += '('
            newVal = trimmed
        }
        else if(char == '-' && charIsADigit(trimmed[trimmed.length-1])){
            trimmed += ') '
            newVal = trimmed
        }
        else if(char == '-' || char == '/'){}
        else if(charIsAnOperator(trimmed[trimmed.length-1]) || trimmed.length == 0){
            return false
        } 
        else if(trimmed.length > 0 && charIsADigit(trimmed[trimmed.length-1])) { 
            trimmed += ') '
            newVal = trimmed
        }
    } 
    else if(charIsADigit(char)) {
        trimmed = newVal.trim()
        if(trimmed.length == 0) { 
            trimmed += '('
            newVal = trimmed
        }
        else if(charIsAnOperator(trimmed[trimmed.length-1]) && trimmed[trimmed.length-1] != '-') {
            trimmed += ' ('
            newVal = trimmed
        }
        else if(trimmed[trimmed.length-1] == '/') {
            newTrim = trimmed.substring(0, trimmed.length - 1).trim()
            if(newTrim[newTrim.length-1] == ')'){
                newTrim += ' / ('
                newVal = newTrim
            }
        }
    }
    newVal += char
    $('#display').focus()
    $('#display').val(newVal)
}

function evaluate() {
    let formula = $('#display').val()
    if(formula != oldFormula) {
        if(formula.length > 0 && charIsADigit(formula[formula.length-1]))
            formula += ')'
        let xhr = new window.XMLHttpRequest()
        let formData = new window.FormData()
        formData.append('formula', formula)
        xhr.open('POST', '/api/evaluate', true)
        xhr.onload = (event) => {
            if (xhr.status === 200) {
                $('#error-label span').addClass('d-none')
                let response = JSON.parse(event.target.response)
                oldFormula = $('#display').val()
                let result = response.result
                $('#display').val(result.common)
            } else {
                $('#error-label span').removeClass('d-none')
                oldFormula = $('#display').val()
                error = true
            }
        }
        xhr.send(formData)
    }
    else if(error) $('#error-label span').removeClass('d-none')
}

function backspace() {
    let oldVal = $('#display').val()
    $('#display').val(oldVal.slice(0, -1))
}

function clearCalc() {
    $('#display').val('')
}

function handleCalculatorClick(type, char) {
    $('#error-label span').addClass('d-none')
    if(type == 'function'){
        switch(char) {
            case 'ce':
                clearCalc()
                break
            case 'backspace':
                backspace()
                break
            case '=':
                evaluate()
                break
        }
    } else {
        appendCharToFormula(char)
    }
}


$(document).ready( () => {
    $("#try-it").click(function() {
        $([document.documentElement, document.body]).animate({
            scrollTop: $("#reveal-main").offset().top
        }, 1500)
    })

    $(document).on('click', '#ce-btn', function() { handleCalculatorClick('function', 'ce') })
    $(document).on('click', '#backspace-btn', function() { handleCalculatorClick('function', 'backspace') })

    $(document).on('click', '#left-bracket-btn', function() { handleCalculatorClick('symbol', '(') })
    $(document).on('click', '#right-bracket-btn', function() { handleCalculatorClick('symbol', ')') })
    $(document).on('click', '#power-btn', function() { handleCalculatorClick('symbol', '^') })
    $(document).on('click', '#divide-btn', function() { handleCalculatorClick('symbol', '/') })

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