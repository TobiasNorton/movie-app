const backToSearch = (event) => {
  location.reload()
}

const getProfile = () => {
  const profileId = window.location.search && window.location.search.slice(4)

  fetch(
    `https://imdb8.p.rapidapi.com/title/get-overview-details?currentCountry=US&tconst=${profileId}`,
    {
      method: 'GET',
      headers: {
        'x-rapidapi-host': 'imdb8.p.rapidapi.com',
        'x-rapidapi-key': '63010853f1msha1e4d8a3ba86bd6p1aa1aajsn43c2af2dca8d',
      },
    }
  )
    .then((response) => {
      return response.json()
    })
    .then((data) => {
      console.log(data)
      const title = document.querySelector('.title')
      title.textContent += data.title && data.title.title

      const year = document.querySelector('.year')
      year.textContent += `(${data.title && data.title.year})`

      const mainImage = document.querySelector('.main-image')
      mainImage.setAttribute('src', data.title && data.title.image && data.title.image.url)

      const rating = document.querySelector('.rating')
      rating.textContent +=
        data.certificates &&
        data.certificates.US &&
        data.certificates.US[0] &&
        data.certificates.US[0].certificate

      const runningTime = document.querySelector('.running-time')
      const runningTimeText = `${data.title && data.title.runningTimeInMinutes} minutes`
      runningTime.textContent += runningTimeText

      const genres = document.querySelector('.genres')
      const genreString = data.genres && data.genres.join(', ')
      genres.textContent += genreString

      const releaseDateUnformatted = new Date(data.releaseDate)
      const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ]

      const monthIndex = releaseDateUnformatted.getMonth()
      const releaseMonth = months[monthIndex]
      const releaseDate = releaseDateUnformatted.getDate()
      const releaseYear = releaseDateUnformatted.getFullYear()
      const releaseDateNode = document.querySelector('.release-date')
      const formattedReleaseDate = `${releaseMonth} ${releaseDate}, ${releaseYear}`
      releaseDateNode.textContent += formattedReleaseDate

      const scoreElement = document.querySelector('.score')
      const score = data.ratings && data.ratings.rating
      scoreElement.textContent += score

      if (scoreElement.textContent) {
        const outOfTen = document.querySelector('.out-of-ten')
        outOfTen.textContent = '/10'

        const totalRatings = document.querySelector('.total-ratings')
        const ratingsCount = data.ratings && data.ratings.ratingCount
        totalRatings.textContent += ratingsCount ? `${ratingsCount} ratings` : 'No ratings'
      }

      const plotOutline = document.querySelector('.plot-outline')
      plotOutline.textContent += data.plotOutline && data.plotOutline.text
    })
    .catch((err) => {
      console.log(err)
    })
}

// TODO: Implement try/catch
const submit = (event) => {
  event.preventDefault()
  const searchForm = document.querySelector('.search-form')
  searchForm.setAttribute('hidden', '')
  const userInput = document.querySelector('.title-input').value
  const spaces = / /gi
  const usableInput = userInput.replaceAll(spaces, '%20')
  fetch(`https://imdb8.p.rapidapi.com/title/auto-complete?q=${usableInput}`, {
    method: 'GET',
    headers: {
      'x-rapidapi-host': 'imdb8.p.rapidapi.com',
      'x-rapidapi-key': '63010853f1msha1e4d8a3ba86bd6p1aa1aajsn43c2af2dca8d',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data)
      const resultsContainer = document.querySelector('.results-container')
      const resultsCount = document.createElement('p')
      resultsContainer.appendChild(resultsCount)
      resultsCount.textContent += `Showing (${data && data.d && data.d.length}) results`
      resultsCount.classList.add('results-count')

      const backToSearchButton = document.querySelector('.back-to-search')
      backToSearchButton.addEventListener('click', backToSearch)

      return (
        data &&
        data.d &&
        data.d.forEach((result) => {
          const resultsItem = document.createElement('div')
          resultsContainer.appendChild(resultsItem)
          resultsItem.classList.add('results-item')

          const resultsItemLeft = document.createElement('div')
          resultsItem.appendChild(resultsItemLeft)
          resultsItemLeft.classList.add('results-item-left')

          const resultsItemRight = document.createElement('div')
          resultsItem.appendChild(resultsItemRight)
          resultsItemRight.classList.add('results-item-right')

          const resultsImage = document.createElement('img')
          resultsItemLeft.appendChild(resultsImage)
          resultsImage.classList.add('results-image')
          if (result.i && result.i.imageUrl) {
            resultsImage.setAttribute('src', result.i.imageUrl)
          } else {
            resultsImage.setAttribute('src', './public/assets/no-image-icon.png')
          }

          if (result.l) {
            const title = document.createElement('h3')
            resultsItemRight.appendChild(title)
            title.textContent += result.l

            if (result.y) {
              title.textContent += ` (${result.y})`
            }
          }

          if (result.s) {
            const cast = document.createElement('p')
            resultsItemRight.appendChild(cast)
            cast.textContent += result.s
          }

          const moreInfo = document.createElement('a')
          resultsItemRight.appendChild(moreInfo)
          moreInfo.setAttribute('href', `/profile.html?id=${result.id}`)
          moreInfo.textContent += 'More Information'

          resultsContainer.removeAttribute('hidden')
        })
      )
    })
    .catch((err) => {
      console.log(err)
    })
}

if (window.location.pathname === '/profile.html') {
  getProfile()
}

if (document.querySelector('.search-form')) {
  document.querySelector('.search-form').onsubmit = submit
}
