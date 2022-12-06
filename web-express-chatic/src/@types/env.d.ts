declare namespace NodeJS {
	interface ProcessEnv {
		readonly FIREBASE__PROJECT_ID: string
		readonly FIREBASE__PRIVATE_KEY: string
		readonly FIREBASE__CLIENT_EMAIL: string
	}
}
