import { step, TestSettings, By, beforeAll, afterAll, Until, ENV, TestData, Browser } from '@flood/element'
import * as assert from 'assert'
import { random, name, internet, address } from 'faker'


export const settings: TestSettings = {
	loopCount: 1,
        description: "DIS Connect E2E Load Test",
        screenshotOnFailure: true,
        disableCache: true,
        clearCache: true,
        clearCookies: true,
        actionDelay: 1.5,
        stepDelay: 2.5,
        ignoreHTTPSErrors: true,
        // Automatically wait for elements before trying to interact with them
        waitUntil: 'visible',
        stages: [
           { duration: '5m', target: 1 },
        ],
}

interface UserData {
  id: string,
  username: string,
  password: string
}

//const globalBrowserID = ENV.FLOOD_GRID_INDEX + '_' + ENV.FLOOD_GRID_NODE_SEQUENCE_ID + '_' + ENV.BROWSER_ID.toString()
//TestData.fromCSV<UserData>('users.csv').filter((line, index, browserID) => line.id === globalBrowserID)
TestData.fromCSV<UserData>("users.csv").shuffle().circular()
//console.log(UserData.username);

export default () => {
	beforeAll(async browser => {
	// Run this hook before running the first step
	   await browser.wait('500ms')
	})

	afterAll(async browser => {
	// Run this hook after running the last step
	   await browser.wait('500ms')
	})

	// If you want to do some actions before/after every single step, use beforeEach/afterEach
	// beforeEach(async browser => {})
	// afterEach(async browser => {})

	step('Launch URL', async (browser: Browser, data: UserData) => {
	   // visit instructs the browser to launch, open a page, and navigate to https://portal-qa.connect.cloud.precisely.services/
	   await browser.visit('https://portal-qa.connect.cloud.precisely.services/')

	   await browser.wait(Until.elementIsEnabled(By.id('idp-discovery-username')))

	   await browser.type(By.id('idp-discovery-username'), data.username)
	   //await browser.type(By.id('idp-discovery-username'), 'petnt103-designer1@precisely.testinator.com')
	   
	})

	step('Navigate to password page', async (browser: Browser, data: UserData) => {
	   await browser.click(By.id('idp-discovery-submit'))
	   await browser.wait(Until.elementIsEnabled(By.id('okta-signin-password')))
	})

	step('Login', async (browser: Browser, data: UserData) => {
	   await browser.type(By.id('okta-signin-password'), 'Password@1234')
	   await browser.click(By.id('okta-signin-submit'))
	   await browser.wait(Until.urlIs("https://portal-qa.connect.cloud.precisely.services/data-integration/home/pipeline"))
	   await browser.takeScreenshot()
	})
	
	step('Logout', async (browser: Browser, data: UserData) => {
	   await browser.click(By.attr('a','data-cy','user-account-image'))
	   await browser.takeScreenshot()
	   await browser.click(By.attr('a','data-cy','user-signout'))
	   await browser.takeScreenshot()
	   await browser.wait(Until.urlIs("https://sso.precisely.services/"))
	   await browser.takeScreenshot()
	})
}
