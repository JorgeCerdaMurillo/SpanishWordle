let elementoResultado = document.querySelector('.result')
let mainContainer=document.querySelector('.main-container')

let rowId=1
//peticion al API de palabras
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1) + min)
  }
  // Ahora, tanto el valor mínimo como el máximo están incluidos en el resultado.
  
var aleatorio =getRandomIntInclusive (3,10)
console.log(aleatorio)
fetch(`https://clientes.api.greenborn.com.ar/public-random-word?c=1&l=${aleatorio}`)
	.then(response => response.json())
    .finally(()=>{
        let loadingElement=document.querySelector('.loading')
        loadingElement.style.display='none'
    })
	.then(data => {
                
        let word = data[0]
        console.log(word)
        let wordArray = word.toUpperCase().split("")
        let actualRow= document.querySelector('.row')
        drawSquares(actualRow)
        listenInput(actualRow)
        addFocusElement(actualRow)


        function listenInput(actualRow){
            let squares=actualRow.querySelectorAll('.square')
            squares=[...squares]
            let userInput=[]
            
            squares.forEach(element=>{
                element.addEventListener('input', event=>{
                    //si no se ha borrado
                    if(event.inputType!=='deleteContentBackward'){
                        //Recoger el ingreso de lusuario
                    userInput.push(event.target.value.toUpperCase())
                    if(event.target.nextElementSibling){
                        event.target.nextElementSibling.focus()
                    }else{
                        //crear el arreglo con las letras llenas
                        let squaresFilled=document.querySelectorAll('.square')
                        squaresFilled=[...squaresFilled]
                        let FinaluserInput=[]
                        let lastUserInput=squaresFilled.slice(-word.length)
                        lastUserInput.forEach(element=>{
                            FinaluserInput.push(element.value.toUpperCase())

                        })
                        //comparar arreglos para cambiar estilos
                    let indicesIguales= compareArrays(wordArray, FinaluserInput)
                    indicesIguales.forEach(element=>{
                        squares[element].classList.add('green')
            
                    })
                        //cambiar estilos si la letra existe en otra posicion
                    let existIndexArray= existIndex(wordArray,FinaluserInput)
                    existIndexArray.forEach(element=>{
                        squares[element].classList.add('yellow')
                    })
                    //si los arreglos son iguales
                    if(indicesIguales.length==wordArray.length){
                        showResult('¡Buen Trabajo!')
                        
                    
                        return
                    }
                        //crear una nueva fila
                    let actualRow=createRow()
                    if(!actualRow){
                        return
                    }
                    drawSquares(actualRow)
                    listenInput(actualRow)
                    addFocusElement(actualRow)

                    }
                    }
                    else{
                        userInput.pop()

                    }
                
            
                })
            
            })
        }

        //FUNCIONES
        function compareArrays(array1, array2){
            let indicesIguales=[]
            array1.forEach((element,index)=>{
                if(element==array2[index]){
                    indicesIguales.push(index)

                }
            })
            return indicesIguales
        }
        function existIndex(array1, array2){
            let existIndexArray=[]
            array2.forEach((element,index)=>{
                if(array1.includes(element)){
                    existIndexArray.push(index)
                }

            })
            return existIndexArray
        }
        function createRow(){
            rowId++
            if(rowId<=5){
                let newRow=document.createElement('div')
                newRow.classList.add('row')
                newRow.setAttribute('id', rowId)
                mainContainer.appendChild(newRow)
                return newRow
            }
            else{
                showResult(`Intentalo de Nuevo, la respuesta correcta era "${word.toUpperCase()}"`)
            }
        
        }
        function drawSquares(actualRow){
            wordArray.forEach((item, index) => {
                if(index==0){
                    actualRow.innerHTML += `<input type="text" maxlength="1" class="square focus">`
                }else{
                    actualRow.innerHTML += `<input type="text" maxlength="1" class="square">`
                }
            })
        }
        function addFocusElement(actualRow){
            let focusElemento=actualRow.querySelector('.focus')
            focusElemento.focus()
        }
        function showResult(textMsg){
            elementoResultado.innerHTML=
            `<p>${textMsg}</p>
            <button class="button">Reiniciar</button>`
            let botonReinicio = document.querySelector('.button')
            botonReinicio.addEventListener('click', ()=>{
                location.reload()
            })
        }
    })
