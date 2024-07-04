var items_data = [];
var first_load = false
var isLoading = false

// Obsługa przewinięcia do końca strony
const products_list = document.getElementById('products_list')
const select_input = document.getElementById('products_on_page')

document.addEventListener('scroll', function () {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {

        if (items_data.length == 0 && !isLoading) {
            loadFromAPI(1)
            return
        }

        if (items_data.pageNumber * items_data.pageSize <= items_data.totalItems && !isLoading) {
            loadFromAPI(items_data.pageNumber + 1)
            return
        }
    }
});

// Obsługa przewijania do sekcji tak żeby część nie była ukryta pod navbarem
// oraz dodawnie podkreslenia przy przewijaniu i klikaniu przycisku
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.navbar_menu_item');

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);

        const offset = navbar.offsetHeight; // Wartość przesunięcia
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
            top: offsetPosition + 1,
            behavior: 'smooth'
        });

        updateActiveLink(targetId)
    });
});

window.addEventListener('scroll', () => {
    let current = '';

    document.querySelectorAll('section').forEach(section => {
        const sectionTop = section.offsetTop - navbar.offsetHeight;
        if (pageYOffset >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    updateActiveLink(current);
});

function updateActiveLink(targetId) {
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === targetId) {
            link.classList.add('active');
        }
    });
}

// ODWOŁADNIE DO API
function loadFromAPI(pageNum) {
    isLoading = true
    fetch(`https://brandstestowy.smallhost.pl/api/random?pageNumber=${pageNum}&pageSize=${select_input.value}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok ${response.statusText}`)
            }
            return response.json()
        })
        .then(data => {
            items_data = data
            createItems(data.data)
            isLoading = false
        })
}

function updatePageLenght(e) {
    products_list.innerHTML = ``
    loadFromAPI(0)
}

function createItems(data) {
    data.forEach((item) => {
        const newItem = document.createElement('div')
        newItem.classList.add('products_list_item')

        newItem.innerHTML = `<h3>ID: ${item.id}</h3>`

        newItem.setAttribute('id', item.id)
        newItem.setAttribute('name', item.name)
        newItem.setAttribute('value', item.value)

        newItem.addEventListener('click', showPopup)

        products_list.appendChild(newItem)
    })
}

// POPUP
const popup = document.getElementById('popup')
// POPUP DATA
const popup_id = document.getElementById('popup_id')
const popup_name = document.getElementById('popup_name')
const popup_value = document.getElementById('popup_value')

function showPopup(e) {
    popup.style.display = 'flex'

    popup_id.innerText = `ID: ${e.target.getAttribute('id')}`
    popup_name.innerText = `Nazwa: ${e.target.getAttribute('name')}`
    popup_value.innerText = `Wartość: ${e.target.getAttribute('value')}`
}

function hidePopup() {
    popup.style.display = 'none'
}