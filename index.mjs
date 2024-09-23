import puppeteer from 'puppeteer'
import dotenv from 'dotenv'
import readline from 'readline'

dotenv.config();

const delay = 5000

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

function menuList() {
    console.log("\n---auto absen by noxx---\n")
    console.log('1. auto absen')
    console.log('2. cek total absen bulan ini')
    console.log('3. cek status absen matkul hari ini\n')
    rl.question('option: ', handleMenuSelection)
}

function handleMenuSelection(option) {
    switch (option) {
        case '1':
            autoAbsen()
            break;
        case '2':
            getAbsentList()
            break
        case '3':
            getAbsenStatus()
            break
        case '4':
            process.exit(0)
        default:
            console.log('invalid option')
    }
}

async function autoAbsen() {
    const browser = await puppeteer.launch({
        executablePath: "C:/Users/ASUS/AppData/Local/Google/Chrome/Application/chrome.exe",
        headless: false
    })
    const page = await browser.newPage();

    await page.setViewport({ width: 1080, height: 1024 })

    await page.goto('https://kalam.umi.ac.id/login/index.php')

    await page.locator('#username').fill(process.env.mhsUsername)
    await page.locator('#password').fill(process.env.mhsPassword)

    await page.locator('#loginbtn').click()

    await page.waitForNavigation()

    await page.goto('https://kalam.umi.ac.id/calendar/view.php')

    const absentEvent = await page.evaluate(() => {
        const absenElement = document.querySelectorAll('.m-t-1')
        const absenArray = [];

        absenElement.forEach(event => {
            const absenTime = event.querySelector('.row > .col-xs-11 > a')?.innerText || "no event name"
            const courseName = event.querySelector('.mt-1 > .col-xs-11 > a')?.innerText || "no event name"

            absenArray.push({
                time: absenTime,
                course: courseName
            })
        })
        return absenArray
    })

    if (absentEvent[0].time === 'Today') {

        console.log(`\nada absen ${absentEvent[0].course} hari ini`)

        setTimeout(() => { }, 2000)
        await page.locator('.mt-1 > .col-xs-11 > a').click()
        await page.waitForNavigation()

        await page.locator('#module-710017 > div > .mod-indent-outer > div > .activityinstance > a').click();

        await page.waitForNavigation()

        const innerText = await page.evaluate(() => {
            const statusElement = document.querySelectorAll('.generaltable > tbody > tr')
            const absenStatusArr = []

            statusElement.forEach(status => {
                const absenDate = status.querySelector('.datecol')?.innerText || "no date found"
                const absenStatus = status.querySelector('.statuscol')?.innerText || "no status found"

                absenStatusArr.push({
                    time: absenDate,
                    status: absenStatus
                })
            })
            return absenStatusArr
        })

        if (innerText[0].status === "Hadir") {
            console.log(`\nabsen ${absentEvent[0].course} sudah terisi`)
        } else if (innerText === "?") {
            console.log(`absen untuk ${absentEvent[0].course} belum tersedia`)
        } else {
            console.log(`mengisi absen ${absentEvent[0].course}....`)
            await page.locator('.c2 > a').click()

            await page.waitForNavigation()
            await page.locator('#id_status_255952').click();

            await page.locator('.fitem > span > #id_submitbutton').click()

            console.log(`absen ${absentEvent[0].course} sudah terisi!`)
        }

    } else {
        return
    }

    await browser.close();
    setTimeout(() => {
        menuList()
    }, delay)
}

async function getAbsentList() {
    const browser = await puppeteer.launch({
        executablePath: "C:/Users/ASUS/AppData/Local/Google/Chrome/Application/chrome.exe",
        headless: false
    })
    const page = await browser.newPage();

    await page.setViewport({ width: 1080, height: 1024 })

    await page.goto('https://kalam.umi.ac.id/login/index.php')

    await page.locator('#username').fill(process.env.mhsUsername)
    await page.locator('#password').fill(process.env.mhsPassword)

    await page.locator('#loginbtn').click()

    await page.waitForNavigation()

    await page.goto('https://kalam.umi.ac.id/calendar/view.php')

    const absentEvent = await page.evaluate(() => {
        const absenElement = document.querySelectorAll('.m-t-1')
        const absenArray = [];

        absenElement.forEach(event => {
            const absenTime = event.querySelector('.row > .col-xs-11 > a')?.innerText || "no event name"
            const courseName = event.querySelector('.mt-1 > .col-xs-11 > a')?.innerText || "no event name"

            absenArray.push({
                time: absenTime,
                course: courseName
            })
        })
        return absenArray
    })

    console.log(absentEvent)
    console.log("\nTotal absen: ", absentEvent.length)
    await browser.close()

    setTimeout(() => {
        menuList()
    }, delay)
}

async function getAbsenStatus() {
    const browser = await puppeteer.launch({
        executablePath: "C:/Users/ASUS/AppData/Local/Google/Chrome/Application/chrome.exe",
        headless: false
    })
    const page = await browser.newPage();

    await page.setViewport({ width: 1080, height: 1024 })

    await page.goto('https://kalam.umi.ac.id/login/index.php')

    await page.locator('#username').fill(process.env.mhsUsername)
    await page.locator('#password').fill(process.env.mhsPassword)

    await page.locator('#loginbtn').click()

    await page.waitForNavigation()

    await page.goto('https://kalam.umi.ac.id/calendar/view.php')

    const absentEvent = await page.evaluate(() => {
        const absenElement = document.querySelectorAll('.m-t-1')
        const absenArray = [];

        absenElement.forEach(event => {
            const absenTime = event.querySelector('.row > .col-xs-11 > a')?.innerText || "no event name"
            const courseName = event.querySelector('.mt-1 > .col-xs-11 > a')?.innerText || "no event name"

            absenArray.push({
                time: absenTime,
                course: courseName
            })
        })
        return absenArray
    })

    console.log(absentEvent)
    console.log("\nTotal absen: ", absentEvent.length)

    if (absentEvent[0].time === 'Today') {

        console.log(`\n ada absen ${absentEvent[0].course} hari ini`)

        setTimeout(() => { }, 2000)
        await page.locator('.mt-1 > .col-xs-11 > a').click()
        await page.waitForNavigation()

        await page.locator('#module-710017 > div > .mod-indent-outer > div > .activityinstance > a').click();

        await page.waitForNavigation()

        const innerText = await page.evaluate(() => {
            const statusElement = document.querySelectorAll('.generaltable > tbody > tr')
            const absenStatusArr = []

            statusElement.forEach(status => {
                const absenDate = status.querySelector('.datecol')?.innerText || "no date found"
                const absenStatus = status.querySelector('.statuscol')?.innerText || "no status found"

                absenStatusArr.push({
                    time: absenDate,
                    status: absenStatus
                })
            })
            return absenStatusArr
        })

        console.log(innerText)

    } else {
        return
    }
    await browser.close();

    setTimeout(() => {
        menuList()
    }, delay)
}

menuList()