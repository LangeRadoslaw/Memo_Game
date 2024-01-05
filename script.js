const allCards = document.querySelectorAll('.card')
const newGameBtn = document.querySelector('.new-game')
const showMoves = document.querySelector('.counter')
const againBtn = document.querySelector('.again-btn')
const cancelBtn = document.querySelector('.cancel-btn')
const winModal = document.querySelector('.win-modal')
const finalScore = document.querySelector('.final-score')
const showHighscoresBtn = document.querySelector('.show-highscores')
const highscoresModal = document.querySelector('.highscores-modal')
const closeHighscoresBtn = document.querySelector('.close-highscores-btn')
const highscoresUlList = document.querySelector('.highscores-list')
let allHighscoresLi = document.getElementsByTagName('li')
const newHighscoreInputArea = document.querySelector('.new-highscore-input-area')
const confirmHighscoreBtn = document.querySelector('.confirm-hs-btn')
const nameInput = document.querySelector('.name')
const resetHighscoresBtn = document.querySelector('.reset-highscores-btn')
const customizationBtn = document.querySelector('.customization-btn')
const customizationPopup = document.querySelector('.customization-popup')
const customizationPopupItems = document.querySelectorAll('.img-custom')
const bgShadow = document.querySelector('.bg-shadow')
const confettiContainer = document.querySelector('.container')
let previousBackColor = 'img-back-1'
let selectedBackColor
const highscoresArr = []
let firstCard = ''
let secondCard = ''
let movesCounter
let matchesCounter
let isProcessing = false

const savedHighscores = localStorage.getItem('highscoresUlList')
if (savedHighscores) {
	highscoresUlList.innerHTML = savedHighscores
}

const shuffleCards = () => {
	allCards.forEach(element => {
		element.classList.remove('showed')
		element.classList.remove('matched')
		const front1 = element.querySelector('.front')
		const back1 = element.querySelector('.back')

		back1.style.opacity = '1'
		back1.style.transform = 'rotateY(0deg)'
		front1.style.opacity = '0'
		front1.style.transform = 'rotateY(-180deg)'

		let newOrder = Math.floor(Math.random() * 100)
		element.style.order = newOrder
	})
	movesCounter = 0
	matchesCounter = 0
	showMoves.textContent = movesCounter
	resetShowedCards()
	closeAllModals()
}

const showCard = id => {
	if (isProcessing == true) {
		return
	}

	const card = document.getElementById(id)
	const front = card.querySelector('.front')
	const back = card.querySelector('.back')

	if (card.classList.contains('matched') || card.classList.contains('showed')) {
		return
	} else {
		card.classList.add('showed')

		back.style.opacity = '0'
		back.style.transform = 'rotateY(180deg)'
		front.style.opacity = '1'
		front.style.transform = 'rotateY(0)'

		if (firstCard == '') {
			firstCard = card
		} else {
			secondCard = card
		}
	}

	firstCard !== '' && secondCard !== '' ? compareCards(firstCard, secondCard) : null
	addMove()
}

const compareCards = (firstCard, secondCard) => {
	if (firstCard.classList.toString() === secondCard.classList.toString()) {
		firstCard.classList.add('matched')
		secondCard.classList.add('matched')
		matchesCounter++
		if (matchesCounter == 12) {
			checkHighscore()
			openWinModal()
		} else {
			resetShowedCards()
		}
	} else {
		isProcessing = true
		setTimeout(() => {
			hideCards(firstCard, secondCard)
			isProcessing = false
		}, 500)
		resetShowedCards()
	}
}

const hideCards = (firstCard, secondCard) => {
	firstCard.classList.remove('showed')
	secondCard.classList.remove('showed')

	const front1 = firstCard.querySelector('.front')
	const back1 = firstCard.querySelector('.back')

	back1.style.opacity = '1'
	back1.style.transform = 'rotateY(0deg)'
	front1.style.opacity = '0'
	front1.style.transform = 'rotateY(-180deg)'

	const front2 = secondCard.querySelector('.front')
	const back2 = secondCard.querySelector('.back')

	back2.style.opacity = '1'
	back2.style.transform = 'rotateY(0deg)'
	front2.style.opacity = '0'
	front2.style.transform = 'rotateY(-180deg)'

	resetShowedCards()
}

const resetShowedCards = () => {
	firstCard = ''
	secondCard = ''
}

const addMove = () => {
	movesCounter++
	showMoves.textContent = movesCounter
	finalScore.textContent = movesCounter
}

const openWinModal = () => {
	winModal.style.visibility = 'visible'
	handleBgShadow()
}

const closeWinModal = () => {
	winModal.style.visibility = 'hidden'
	handleBgShadow()
}

const showHighscoresModal = () => {
	highscoresModal.style.visibility = 'visible'
	handleBgShadow()
}

const closeHighscoresModal = () => {
	highscoresModal.style.visibility = 'hidden'
	handleBgShadow()
}

const checkHighscore = () => {
	if (allHighscoresLi.length < 10) {
		newHighscoreInputArea.style.height = '250px'
		showConfetti()
	}

	allHighscoresLi.length > 1 && allHighscoresLi.length < 11 ? sortHighscores() : null

	if (allHighscoresLi.length == 10) {
		const lastHighscore = allHighscoresLi[9]

		if (movesCounter + 1 < parseInt(lastHighscore.getAttribute('data-moves-counter'))) {
			highscoresUlList.lastChild.remove()
			newHighscoreInputArea.style.height = '250px'
			showConfetti()
		}
	}
}

const addNewHighscore = () => {
	const newHighscoreLi = document.createElement('li')
	newHighscoreLi.setAttribute('data-moves-counter', movesCounter)
	newHighscoreLi.innerHTML = `${nameInput.value}<span class="highscore">${movesCounter}</span>`
	highscoresUlList.append(newHighscoreLi)
	sortHighscores()
	newHighscoreInputArea.style.height = '0'
	localStorage.setItem('highscoresUlList', highscoresUlList.innerHTML) // - locl storage
	hideConfetti()
}

const sortHighscores = () => {
	const highscoresArr = Array.from(allHighscoresLi)
	highscoresArr.sort((a, b) => {
		const aOrder = parseInt(a.dataset.movesCounter)
		const bOrder = parseInt(b.dataset.movesCounter)
		return aOrder - bOrder
	})
	highscoresUlList.innerHTML = ''
	highscoresArr.forEach(li => highscoresUlList.append(li))
}

const resetHighscores = () => {
	if (confirm('Czy na pewno chcesz usunąć wszystkie wyniki?')) {
		localStorage.clear()
		location.reload()
	}
}

const customize = () => {
	handleBgShadow()
	customizationPopup.classList.toggle('show-popup')
	customizationPopupItems.forEach(el => {
		el.addEventListener('click', () => {
			selectedBackColor = el.classList.toString().slice(-10)
			changeBackColor(selectedBackColor)
		})
	})
}

const changeBackColor = selectedBackColor => {
	allCards.forEach(el => {
		let cardToChange = el.querySelector('.back')
		cardToChange.classList.remove(previousBackColor)
		cardToChange.classList.add(selectedBackColor)
	})
	previousBackColor = selectedBackColor
}

const closeAllModals = () => {
	closeHighscoresModal()
	closeWinModal()
	closeCustomizationPopup()
	hideConfetti()
	bgShadow.style.display = 'none'
}

const closeCustomizationPopup = () => {
	customizationPopup.classList.remove('show-popup')
}

const handleBgShadow = () => {
	bgShadow.style.display == 'block' ? (bgShadow.style.display = 'none') : (bgShadow.style.display = 'block')
}

const showConfetti = () => {
	confettiContainer.style.display = 'block'
}

const hideConfetti = () => {
	confettiContainer.style.display = 'none'
}

newGameBtn.addEventListener('click', shuffleCards)
againBtn.addEventListener('click', shuffleCards)
cancelBtn.addEventListener('click', closeWinModal)
showHighscoresBtn.addEventListener('click', showHighscoresModal)
closeHighscoresBtn.addEventListener('click', closeHighscoresModal)
confirmHighscoreBtn.addEventListener('click', addNewHighscore)
resetHighscoresBtn.addEventListener('click', resetHighscores)
customizationBtn.addEventListener('click', customize)
bgShadow.addEventListener('click', closeAllModals)

shuffleCards()

/* ================== Konfetti ==================================== */

const Confettiful = function (el) {
	this.el = el
	this.containerEl = null

	this.confettiFrequency = 3
	this.confettiColors = ['#fce18a', '#ff726d', '#b48def', '#f4306d']
	this.confettiAnimations = ['slow', 'medium', 'fast']

	this._setupElements()
	this._renderConfetti()
}

Confettiful.prototype._setupElements = function () {
	const containerEl = document.createElement('div')
	const elPosition = this.el.style.position

	if (elPosition !== 'relative' || elPosition !== 'absolute') {
		this.el.style.position = 'relative'
	}

	containerEl.classList.add('confetti-container')

	this.el.appendChild(containerEl)

	this.containerEl = containerEl
}

Confettiful.prototype._renderConfetti = function () {
	this.confettiInterval = setInterval(() => {
		const confettiEl = document.createElement('div')
		const confettiSize = Math.floor(Math.random() * 3) + 7 + 'px'
		const confettiBackground = this.confettiColors[Math.floor(Math.random() * this.confettiColors.length)]
		const confettiLeft = Math.floor(Math.random() * this.el.offsetWidth) + 'px'
		const confettiAnimation = this.confettiAnimations[Math.floor(Math.random() * this.confettiAnimations.length)]

		confettiEl.classList.add('confetti', 'confetti--animation-' + confettiAnimation)
		confettiEl.style.left = confettiLeft
		confettiEl.style.width = confettiSize
		confettiEl.style.height = confettiSize
		confettiEl.style.backgroundColor = confettiBackground

		confettiEl.removeTimeout = setTimeout(function () {
			confettiEl.parentNode.removeChild(confettiEl)
		}, 3000)

		this.containerEl.appendChild(confettiEl)
	}, 25)
}

window.confettiful = new Confettiful(document.querySelector('.js-container'))
