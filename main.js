const cityInput = document.getElementById('city-input')
const submitBtn = document.getElementById('city-input-btn')
const errorMsg = document.getElementById('error-message')
const language = document.getElementById('language')
const backBtn = document.getElementById('back-button')
const convertButton = document.getElementById('convert-button')
const inputDiv = document.querySelector('.input')
const weatherInfoDiv = document.querySelector('.weather-info')
const date = document.getElementById('date')
const temperature = document.getElementById('temperature')
const cityName = document.getElementById('city')
const weatherMain = document.getElementById('weather')
const weatherDescription = document.getElementById('weather-description')
const feelsLike = document.getElementById('feels-like')
const lowTemp = document.getElementById('low-temp')
const highTemp = document.getElementById('high-temp')
const humidity = document.getElementById('humidity')
const pressure = document.getElementById('pressure')
const modal = document.querySelector('.modal-container')
const weatherIcon = document.getElementById('weather-icon')
const infoToggleButton = document.getElementById('info-toggle')
const bottomDisplay = document.querySelector('.bottom-display')
const airPollutionDisplay = document.querySelector('.air-pollution-display')
const pm25 = document.getElementById('pm25')
const pm10 = document.getElementById('pm10')
const ozone = document.getElementById('ozone')
const nitrogenDioxide = document.getElementById('no2')
const carbonMonoxide = document.getElementById('co')
const aqiInfo = document.querySelector('.aqi-info')

async function getData(units = 'metric') {

    let weatherData
    let airData
    
    try {
        clearScreen()
        const fetchWeatherData = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${cityInput.value}&lang=${language.value}&APPID=b2214ca14b0cd74410971500f6604996&units=${units}`)

        const jsonWeatherData = await fetchWeatherData.json()

        weatherData = {...jsonWeatherData}

        console.log(fetchWeatherData)
        console.log(jsonWeatherData)

        const fetchAirData = await fetch(`http://api.openweathermap.org/data/2.5/air_pollution?lat=${jsonWeatherData.coord.lat}&lon=${jsonWeatherData.coord.lon}&appid=b2214ca14b0cd74410971500f6604996`)

        const jsonAirData = await fetchAirData.json();
        airData = {...jsonAirData}

        temperature.textContent = `${roundTemp(jsonWeatherData.main.temp)}°`
        cityName.textContent = `${jsonWeatherData.name}, ${convertCountryName(jsonWeatherData.sys.country)}`
        weatherMain.textContent = `${jsonWeatherData.weather[0].main}`
        weatherDescription.textContent = `${jsonWeatherData.weather[0].description}`
        feelsLike.textContent = `${roundTemp(jsonWeatherData.main.feels_like)}°`
        lowTemp.textContent = `${roundTemp(jsonWeatherData.main.temp_min)}°`
        highTemp.textContent = `${roundTemp(jsonWeatherData.main.temp_max)}°`
        humidity.textContent = `${jsonWeatherData.main.humidity}%`
        pressure.textContent = `${jsonWeatherData.main.pressure}mb`
        weatherIcon.setAttribute('src', `./icons/${jsonWeatherData.weather[0].icon}.png`)
        pm25.textContent = jsonAirData.list[0].components.pm2_5
        pm10.textContent = jsonAirData.list[0].components.pm10
        ozone.textContent = jsonAirData.list[0].components.o3
        nitrogenDioxide.textContent = jsonAirData.list[0].components.no2
        carbonMonoxide.textContent = jsonAirData.list[0].components.co

        console.log(`Air pollution -- PM2.5: ${jsonAirData.list[0].components.pm2_5}, PM10: ${jsonAirData.list[0].components.pm10}`)
        console.log(jsonAirData)

    } catch(err) {
        console.log(err)
        errorMsg.classList.add('active')
        inputDiv.classList.remove('hidden')
    }
    
    //Date
    addDate()
    //Background Image
    modal.classList.add(backgroundImage(weatherData.weather[0].id, weatherData.sys.sunrise, weatherData.sys.sunrise, weatherData.wind.speed))

    aqiAnalysis(airData.list[0].components.pm2_5, airData.list[0].components.pm10, airData.list[0].components.o3, airData.list[0].components.no2, airData.list[0].components.co)

    weatherInfoDiv.classList.remove('hidden')
}

backBtn.addEventListener('click', () => {
    clearInputs()
    modal.className = '';
    modal.classList.add('modal-container')
    convertButton.classList.remove('celcius')
    if (convertButton.classList.contains('farenheit')) {
        convertButton.classList.add('farenheit')
        convertButton.textContent = '°F'
        weatherInfoDiv.classList.add('hidden')
    }
    inputDiv.classList.remove('hidden')
    if (infoToggleButton.textContent === 'Weather Info') {
        airPollutionDisplay.classList.add('hidden')
        aqiInfo.classList.add('hidden')
        bottomDisplay.classList.remove('hidden')
        infoToggleButton.textContent = 'AQI Info'
    }
})

convertButton.addEventListener('click', () => {
    toNewTemp()
    if (convertButton.classList.contains('farenheit')) {
        convertButton.classList.remove('farenheit')
        convertButton.classList.add('celcius')
        convertButton.textContent = '°C'
    } else {
        convertButton.classList.remove('celcius')
        convertButton.classList.add('farenheit')
        convertButton.textContent = '°F'
    }
})

infoToggleButton.addEventListener('click', () => {
    if (infoToggleButton.textContent === 'AQI Info') {
        bottomDisplay.classList.add('hidden')
        airPollutionDisplay.classList.remove('hidden')
        aqiInfo.classList.remove('hidden')
        infoToggleButton.textContent = 'Weather Info'
    } else {
        airPollutionDisplay.classList.add('hidden')
        aqiInfo.classList.add('hidden')
        bottomDisplay.classList.remove('hidden')
        infoToggleButton.textContent = 'AQI Info'
    }
})

submitBtn.addEventListener('click', (e) => {
    e.preventDefault()
    if (cityInput.valueMissing) {
        console.log('missing')
        errorMsg.classList.add('active')
    } else {
        getData()
        inputDiv.classList.add('hidden')
        errorMsg.classList.remove('active')
    }
    clearScreen()
})

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'enter') {
        e.preventDefault()
        submitBtn.click()
    }
})

function clearScreen() {
    date.textContent = "" 
    temperature.textContent = "" 
    cityName.textContent = "" 
    weatherMain.textContent = "" 
    weatherDescription.textContent = ""
    feelsLike.textContent = ""
    lowTemp.textContent = ""
    highTemp.textContent = ""
    humidity.textContent = ""
    pressure.textContent = ""
}

function clearInputs() {
    cityInput.value = ""
    language.value = "en"
}

function convertCountryName(countryCode) {
    const hasProperty = Object.prototype.hasOwnProperty;
    if (hasProperty.call(isoCountries, countryCode)) {
        return isoCountries[countryCode]
    } else {
        return countryCode
    }
}

function addDate() {
    const localDate = new Date;
    
    if (language.value === 'kr') {
        date.textContent = '주체 ' + jucheYear(localDate) + " " + (localDate.getMonth() + 1) + "월 " + (localDate.getDate()) + "일"
    } else if (language.value === 'ja' || language.value === 'zh_cn') {
        date.textContent = localDate.toLocaleDateString('ko-KR')
    } else {
        const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        date.textContent = localDate.toLocaleDateString("en-US", dateOptions)
    }
}

function jucheYear(localDate) {
    const currentYear = localDate.getFullYear()
    console.log(currentYear)
    return currentYear - 1911
}

function roundTemp(temp) {
    return Math.round(temp)
}

function toNewTemp() {
    temperature.textContent = `${tempConvert(temperature.textContent)}°`
    feelsLike.textContent = `${tempConvert(feelsLike.textContent)}°`
    lowTemp.textContent = `${tempConvert(lowTemp.textContent)}°`
    highTemp.textContent =`${tempConvert(highTemp.textContent)}°`
}

function tempConvert(temp) {
    temp = parseInt(temp)
    if (convertButton.classList.contains('farenheit')) {
        return roundTemp((temp * (9/5)) + 32)
    } else {
        return roundTemp((temp - 32) * (5/9))
    }
    
} 

function aqiAnalysis(pm2_5, pm_10, ozone_fig, nitrogenDioxide_fig, carbonMonoxide_fig) {
    if (pm2_5 <= 30) {
        pm25.style.background = ('rgba(0, 255, 0, .5)')
    } else if (pm2_5 <= 60) {
        pm25.style.background = ('rgba(102, 204, 0, .5)')
    } else if (pm2_5 <= 90) {
        pm25.style.background = ('rgba(255, 255, 0, .5)')
    } else if (pm2_5 <= 120) {
        pm25.style.background = ('rgba(255, 153, 0, .5)')
    } else if (pm2_5 <= 250) {
        pm25.style.background = ('rgba(255, 0, 0, .5)')
    } else if (pm2_5 > 250) {
        pm25.style.background = ('rgba(165, 42, 42, .5)')
    } else {
        pm25.style.background = ('rgba(0, 0, 0, 0)')
    }

    if (pm_10 <= 50) {
        pm10.style.background = ('rgba(0, 255, 0, .5)')
    } else if (pm_10 <= 100) {
        pm10.style.background = ('rgba(102, 204, 0, .5)')
    } else if (pm_10 <= 250) {
        pm10.style.background = ('rgba(255, 255, 0, .5)')
    } else if (pm_10 <= 350) {
        pm10.style.background = ('rgba(255, 153, 0, .5)')
    } else if (pm_10 <= 430) {
        pm10.style.background = ('rgba(255, 0, 0, .5)')
    } else if (pm_10 > 430) {
        pm10.style.background = ('rgba(165, 42, 42, .5)')
    } else {
        pm10.style.background = ('rgba(0, 0, 0, 0)')
    }

    if (ozone_fig <= 50) {
        ozone.style.background = ('rgba(0, 255, 0, .5)')
    } else if (ozone_fig <= 100) {
        ozone.style.background = ('rgba(102, 204, 0, .5)')
    } else if (ozone_fig <= 168) {
        ozone.style.background = ('rgba(255, 255, 0, .5)')
    } else if (ozone_fig <= 208) {
        ozone.style.background = ('rgba(255, 153, 0, .5)')
    } else if (ozone_fig <= 748) {
        ozone.style.background = ('rgba(255, 0, 0, .5)')
    } else if (ozone_fig > 748) {
        ozone.style.background = ('rgba(165, 42, 42, .5)')
    } else {
        ozone.style.background = ('rgba(0, 0, 0, 0)')
    }

    if (nitrogenDioxide_fig <= 40) {
        nitrogenDioxide.style.background = ('rgba(0, 255, 0, .5)')
    } else if (nitrogenDioxide_fig <= 80) {
        nitrogenDioxide.style.background = ('rgba(102, 204, 0, .5)')
    } else if (nitrogenDioxide_fig <= 180) {
        nitrogenDioxide.style.background = ('rgba(255, 255, 0, .5)')
    } else if (nitrogenDioxide_fig <= 280) {
        nitrogenDioxide.style.background = ('rgba(255, 153, 0, .5)')
    } else if (nitrogenDioxide_fig <= 400) {
        nitrogenDioxide.style.background = ('rgba(255, 0, 0, .5)')
    } else if (nitrogenDioxide_fig > 400) {
        nitrogenDioxide.style.background = ('rgba(165, 42, 42, .5)')
    } else {
        nitrogenDioxide.style.background = ('rgba(0, 0, 0, 0)')
    }

    if (carbonMonoxide_fig <= 1.0) {
        carbonMonoxide.style.background = ('rgba(0, 255, 0, .5)')
    } else if (carbonMonoxide_fig <= 2.0) {
        carbonMonoxide.style.background = ('rgba(102, 204, 0, .5)')
    } else if (carbonMonoxide_fig <= 10) {
        carbonMonoxide.style.background = ('rgba(255, 255, 0, .5)')
    } else if (carbonMonoxide_fig <= 17) {
        carbonMonoxide.style.background = ('rgba(255, 153, 0, .5)')
    } else if (carbonMonoxide_fig <= 34) {
        carbonMonoxide.style.background = ('rgba(255, 0, 0, .5)')
    } else if (carbonMonoxide_fig > 34) {
        carbonMonoxide.style.background = ('rgba(165, 42, 42, .5)')
    } else {
        carbonMonoxide.style.background = ('rgba(0, 0, 0, 0)')
    }
    
}


//TODO: test a little more for sunrise/sunset & night img. Data from API sometimes gives same info, causing them to trigger when not correct. Currently fixed with last argument '!='
function backgroundImage(id, sunrise, sunset, windSpeed) {
    console.log(`ID: ${id}`)
    let currentTime = Math.round(new Date().getTime() / 1000)

    console.log(`currentTime: ${currentTime} && sunrise: ${sunrise} && sunset: ${sunset} sunrise == sunset ${sunrise == sunset}`)

    if (language.value === 'kr') {

        if (id >= 200 && id <= 531 && id != 212) {
            return 'nk-rain'
        } else if (id === 212) {
            return 'nk-typhoon'
        } else if (id >= 600 && id <= 622) {
            return 'nk-snow'
        } else if (id >= 701 && id <= 781) {
            return 'nk-fog'
        } else if ((((currentTime - sunrise) < 1800 && (currentTime - sunrise) > 0) ||  ((sunrise - currentTime) < 1800 && (sunrise - currentTime) > 0)  || ((currentTime - sunset) < 1800 && (currentTime - sunset) > 0) ||  ((sunset - currentTime) < 1800 && (sunset - currentTime) > 0)) && (sunrise != sunset)) {
            return 'nk-sunset'
        } else if ((currentTime <= sunrise || currentTime >= sunset) && (sunrise != sunset)) {
            return 'nk-night'
        } else if (windSpeed > 13) {
            return 'nk-wind'
        } else if (id === 800) {
            return 'nk-sun'
        } else if (id === 801) {
            return 'nk-clear'
        } else if (id === 802) {
            return 'nk-clouds'
        } else if (id > 802) {
            return 'nk-overcast'
        }
        //TODO: add an else with default img

    } else {
        if (id >= 200 && id <= 232) {
            return 'lightning'
        } else if (id >= 300 && id <= 531) {
            return 'rain'
        } else if (id >= 600 && id <= 622) {
            return 'snow'
        } else if (id >= 701 && id <= 781) {
            return 'fog'
        } else if  ((((currentTime - sunrise) < 1800 && (currentTime - sunrise) > 0)||  ((sunrise - currentTime) < 1800 && (sunrise - currentTime) > 0)  || ((currentTime - sunset) < 1800 && (currentTime - sunset) > 0) ||  ((sunset - currentTime) < 1800 && (sunset - currentTime) > 0)) && (sunrise != sunset)) {
            return 'sunset'
        } else if ((currentTime <= sunrise || currentTime >= sunset) && (sunrise != sunset)) {
            return 'night'
        } else if (id === 800) {
            return 'sun'
        } else if (id === 801) {
            return 'p-cloud'
        } else if (id === 802 || id === 803) {
            return 'cloud'
        } else if (id === 804) {
            return 'overcast'
        }
        //TODO: add else with default img
    }
}

//Give accurate local time for location
function convertTime(time, timezone) {
    let localTime = new Date((time + timezone) * 1000)
    return localTime
}

const isoCountries = {
    'AF' : 'Afghanistan',
    'AX' : 'Aland Islands',
    'AL' : 'Albania',
    'DZ' : 'Algeria',
    'AS' : 'American Samoa',
    'AD' : 'Andorra',
    'AO' : 'Angola',
    'AI' : 'Anguilla',
    'AQ' : 'Antarctica',
    'AG' : 'Antigua And Barbuda',
    'AR' : 'Argentina',
    'AM' : 'Armenia',
    'AW' : 'Aruba',
    'AU' : 'Australia',
    'AT' : 'Austria',
    'AZ' : 'Azerbaijan',
    'BS' : 'Bahamas',
    'BH' : 'Bahrain',
    'BD' : 'Bangladesh',
    'BB' : 'Barbados',
    'BY' : 'Belarus',
    'BE' : 'Belgium',
    'BZ' : 'Belize',
    'BJ' : 'Benin',
    'BM' : 'Bermuda',
    'BT' : 'Bhutan',
    'BO' : 'Bolivia',
    'BA' : 'Bosnia And Herzegovina',
    'BW' : 'Botswana',
    'BV' : 'Bouvet Island',
    'BR' : 'Brazil',
    'IO' : 'British Indian Ocean Territory',
    'BN' : 'Brunei Darussalam',
    'BG' : 'Bulgaria',
    'BF' : 'Burkina Faso',
    'BI' : 'Burundi',
    'KH' : 'Cambodia',
    'CM' : 'Cameroon',
    'CA' : 'Canada',
    'CV' : 'Cape Verde',
    'KY' : 'Cayman Islands',
    'CF' : 'Central African Republic',
    'TD' : 'Chad',
    'CL' : 'Chile',
    'CN' : 'China',
    'CX' : 'Christmas Island',
    'CC' : 'Cocos (Keeling) Islands',
    'CO' : 'Colombia',
    'KM' : 'Comoros',
    'CG' : 'Congo',
    'CD' : 'Congo, Democratic Republic',
    'CK' : 'Cook Islands',
    'CR' : 'Costa Rica',
    'CI' : 'Cote D\'Ivoire',
    'HR' : 'Croatia',
    'CU' : 'Cuba',
    'CY' : 'Cyprus',
    'CZ' : 'Czech Republic',
    'DK' : 'Denmark',
    'DJ' : 'Djibouti',
    'DM' : 'Dominica',
    'DO' : 'Dominican Republic',
    'EC' : 'Ecuador',
    'EG' : 'Egypt',
    'SV' : 'El Salvador',
    'GQ' : 'Equatorial Guinea',
    'ER' : 'Eritrea',
    'EE' : 'Estonia',
    'ET' : 'Ethiopia',
    'FK' : 'Falkland Islands (Malvinas)',
    'FO' : 'Faroe Islands',
    'FJ' : 'Fiji',
    'FI' : 'Finland',
    'FR' : 'France',
    'GF' : 'French Guiana',
    'PF' : 'French Polynesia',
    'TF' : 'French Southern Territories',
    'GA' : 'Gabon',
    'GM' : 'Gambia',
    'GE' : 'Georgia',
    'DE' : 'Germany',
    'GH' : 'Ghana',
    'GI' : 'Gibraltar',
    'GR' : 'Greece',
    'GL' : 'Greenland',
    'GD' : 'Grenada',
    'GP' : 'Guadeloupe',
    'GU' : 'Guam',
    'GT' : 'Guatemala',
    'GG' : 'Guernsey',
    'GN' : 'Guinea',
    'GW' : 'Guinea-Bissau',
    'GY' : 'Guyana',
    'HT' : 'Haiti',
    'HM' : 'Heard Island & Mcdonald Islands',
    'VA' : 'Holy See (Vatican City State)',
    'HN' : 'Honduras',
    'HK' : 'Hong Kong',
    'HU' : 'Hungary',
    'IS' : 'Iceland',
    'IN' : 'India',
    'ID' : 'Indonesia',
    'IR' : 'Iran, Islamic Republic Of',
    'IQ' : 'Iraq',
    'IE' : 'Ireland',
    'IM' : 'Isle Of Man',
    'IL' : 'Israel',
    'IT' : 'Italy',
    'JM' : 'Jamaica',
    'JP' : 'Japan',
    'JE' : 'Jersey',
    'JO' : 'Jordan',
    'KZ' : 'Kazakhstan',
    'KE' : 'Kenya',
    'KI' : 'Kiribati',
    'KP' : 'Democractic People\'s Republic of Korea',
    'KR' : 'Republic of Korea',
    'KW' : 'Kuwait',
    'KG' : 'Kyrgyzstan',
    'LA' : 'Lao People\'s Democratic Republic',
    'LV' : 'Latvia',
    'LB' : 'Lebanon',
    'LS' : 'Lesotho',
    'LR' : 'Liberia',
    'LY' : 'Libyan Arab Jamahiriya',
    'LI' : 'Liechtenstein',
    'LT' : 'Lithuania',
    'LU' : 'Luxembourg',
    'MO' : 'Macao',
    'MK' : 'Macedonia',
    'MG' : 'Madagascar',
    'MW' : 'Malawi',
    'MY' : 'Malaysia',
    'MV' : 'Maldives',
    'ML' : 'Mali',
    'MT' : 'Malta',
    'MH' : 'Marshall Islands',
    'MQ' : 'Martinique',
    'MR' : 'Mauritania',
    'MU' : 'Mauritius',
    'YT' : 'Mayotte',
    'MX' : 'Mexico',
    'FM' : 'Micronesia, Federated States Of',
    'MD' : 'Moldova',
    'MC' : 'Monaco',
    'MN' : 'Mongolia',
    'ME' : 'Montenegro',
    'MS' : 'Montserrat',
    'MA' : 'Morocco',
    'MZ' : 'Mozambique',
    'MM' : 'Myanmar',
    'NA' : 'Namibia',
    'NR' : 'Nauru',
    'NP' : 'Nepal',
    'NL' : 'Netherlands',
    'AN' : 'Netherlands Antilles',
    'NC' : 'New Caledonia',
    'NZ' : 'New Zealand',
    'NI' : 'Nicaragua',
    'NE' : 'Niger',
    'NG' : 'Nigeria',
    'NU' : 'Niue',
    'NF' : 'Norfolk Island',
    'MP' : 'Northern Mariana Islands',
    'NO' : 'Norway',
    'OM' : 'Oman',
    'PK' : 'Pakistan',
    'PW' : 'Palau',
    'PS' : 'Palestinian Territory, Occupied',
    'PA' : 'Panama',
    'PG' : 'Papua New Guinea',
    'PY' : 'Paraguay',
    'PE' : 'Peru',
    'PH' : 'Philippines',
    'PN' : 'Pitcairn',
    'PL' : 'Poland',
    'PT' : 'Portugal',
    'PR' : 'Puerto Rico',
    'QA' : 'Qatar',
    'RE' : 'Reunion',
    'RO' : 'Romania',
    'RU' : 'Russian Federation',
    'RW' : 'Rwanda',
    'BL' : 'Saint Barthelemy',
    'SH' : 'Saint Helena',
    'KN' : 'Saint Kitts And Nevis',
    'LC' : 'Saint Lucia',
    'MF' : 'Saint Martin',
    'PM' : 'Saint Pierre And Miquelon',
    'VC' : 'Saint Vincent And Grenadines',
    'WS' : 'Samoa',
    'SM' : 'San Marino',
    'ST' : 'Sao Tome And Principe',
    'SA' : 'Saudi Arabia',
    'SN' : 'Senegal',
    'RS' : 'Serbia',
    'SC' : 'Seychelles',
    'SL' : 'Sierra Leone',
    'SG' : 'Singapore',
    'SK' : 'Slovakia',
    'SI' : 'Slovenia',
    'SB' : 'Solomon Islands',
    'SO' : 'Somalia',
    'ZA' : 'South Africa',
    'GS' : 'South Georgia And Sandwich Isl.',
    'ES' : 'Spain',
    'LK' : 'Sri Lanka',
    'SD' : 'Sudan',
    'SR' : 'Suriname',
    'SJ' : 'Svalbard And Jan Mayen',
    'SZ' : 'Swaziland',
    'SE' : 'Sweden',
    'CH' : 'Switzerland',
    'SY' : 'Syrian Arab Republic',
    'TW' : 'Taiwan',
    'TJ' : 'Tajikistan',
    'TZ' : 'Tanzania',
    'TH' : 'Thailand',
    'TL' : 'Timor-Leste',
    'TG' : 'Togo',
    'TK' : 'Tokelau',
    'TO' : 'Tonga',
    'TT' : 'Trinidad And Tobago',
    'TN' : 'Tunisia',
    'TR' : 'Turkey',
    'TM' : 'Turkmenistan',
    'TC' : 'Turks And Caicos Islands',
    'TV' : 'Tuvalu',
    'UG' : 'Uganda',
    'UA' : 'Ukraine',
    'AE' : 'United Arab Emirates',
    'GB' : 'United Kingdom',
    'US' : 'United States',
    'UM' : 'United States Outlying Islands',
    'UY' : 'Uruguay',
    'UZ' : 'Uzbekistan',
    'VU' : 'Vanuatu',
    'VE' : 'Venezuela',
    'VN' : 'Viet Nam',
    'VG' : 'Virgin Islands, British',
    'VI' : 'Virgin Islands, U.S.',
    'WF' : 'Wallis And Futuna',
    'EH' : 'Western Sahara',
    'YE' : 'Yemen',
    'ZM' : 'Zambia',
    'ZW' : 'Zimbabwe'
};