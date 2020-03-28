function appendCharToFormula(char){
    let oldVal = $('textarea#display').val()
    $('textarea#display').val(oldVal + char)
}

function evaluate() {
    let formula = $('textarea#display').val()
    let xhr = new window.XMLHttpRequest()
    let formData = new window.FormData()
    formData.append('formula', formula)
    xhr.open('POST', '/api/evaluate', true)
    xhr.onload = (event) => {
        if (xhr.status === 200) {
            let response = JSON.parse(event.target.response)
            let oldFormula = $('textarea#display').val()
            let result = response.result
            $('textarea#display').val(result.common)
        } else {
            console.log('fail ' + xhr.status)
        }
    }
    xhr.send(formData)
}

function backspace() {
    let oldVal = $('textarea#display').val()
    $('textarea#display').val(oldVal.slice(0, -1))
}

function clearCalc() {

}

function handleCalculatorClick(type, char) {
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
            scrollTop: $("#calculator").offset().top
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