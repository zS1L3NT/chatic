import "dotenv/config"

import { cert, initializeApp } from "firebase-admin/app"

export default initializeApp({
	credential: cert({
		projectId: process.env.FIREBASE__PROJECT_ID,
		privateKey: process.env.FIREBASE__PRIVATE_KEY,
		clientEmail: process.env.FIREBASE__CLIENT_EMAIL
	})
})
