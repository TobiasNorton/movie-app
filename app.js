const submit = (event) => {
  event.preventDefault()
  searchForm.setAttribute('hidden', '')
  const userInput = document.querySelector('.title-input').value
  const spaces = / /gi
  const usableInput = userInput.replaceAll(spaces, '')
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
    })
    .catch((err) => {
      console.log(err)
    })
}

const searchForm = document.querySelector('.search-form')
searchForm.onsubmit = submit

// TODO: Make submit function work for all form submissions, accepting url and userInput as params
