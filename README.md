# Chatic

![License](https://img.shields.io/github/license/zS1L3NT/chatic?style=for-the-badge) ![Languages](https://img.shields.io/github/languages/count/zS1L3NT/chatic?style=for-the-badge) ![Top Language](https://img.shields.io/github/languages/top/zS1L3NT/chatic?style=for-the-badge) ![Commit Activity](https://img.shields.io/github/commit-activity/y/zS1L3NT/chatic?style=for-the-badge) ![Last commit](https://img.shields.io/github/last-commit/zS1L3NT/chatic?style=for-the-badge)

Chatic is one of my longest running projects that I never got to complete. The idea was to make a Chat App/Website that functions just like WhatsApp. None of the subrepositories here contain a project that is fully functional.

Order of Editions (from oldest to newest):
-   [`web-chatbubble`](web-chatbubble)
-   [`android-chatic-v1`](android-chatic-v1)
-   [`android-chatic-v2`](android-chatic-v2)
-   [`web-react-chatic`](web-react-chatic) and [`web-express-chatic`](web-express-chatic)

Some of these repositories only have a few commits on them because I built some of these projects before I started using Git and GitHub habitually.

## Motivation

I can't remember why I decided to build a chat website, but it was the first programming project I decided to take on.

## Subrepositories

### [`android-chatic-v1`](android-chatic-v1)

This is the second edition of Chatic written in Java which I tried to build before I started my education at Temasek Polytechnic. I was hoping that I could use this as a deliverable for the first semester but the requirements were for a music streaming application instead of a Chat application, hence the project was discontinued and abandoned.

### [`android-chatic-v2`](android-chatic-v2)

This is the third edition of Chatic written in Kotlin. I decided to try rebuilding Chatic in Kotlin after my first semester at Temasek Polytechnic since I already learnt enough Java that semester and wanted to try writing an application in Kotlin. I decided to terminate this project because I wanted to use MongoDB Realm with Chatic. However, back when I was building it, the Realm Android SDK was still in Alpha and there was a serious lack of documentation and testing for it.

### [`web-express-chatic`](web-express-chatic)

This Express server is part of the fourth edition of Chatic. It just served as a way I can clean up the Firestore database after doing some testing.

### [`web-react-chatic`](web-react-chatic)

This is the fourth edition of Chatic written with React and TypeScript. I had high hopes that I could submit this project for my Year 2 Semester 1 web project deliverable, so I could finally finish at least one edition of Chatic. However the requirements were for me to use a Laravel server too.

### [`web-chatbubble`](web-chatbubble)

This is the first edition of Chatic written in React and JavaScript. This is probably the oldest and messiest repository on my GitHub account. It was one of the first web project I worked on. It uses SocketIO and MongoDB to transport messages between the frontend and backend. The React frontend code barely uses small components for the UI. It was a mess.

This messy codebase was the reason I decided to rename ChatBubble to Chatic and made me want to rebuild it **properly**.

## Built with

-   Android v1
    -   Android
        -   [![com.google.firebase:firebase-bom](https://img.shields.io/badge/com.google.firebase%3Afirebase--bom-26.8.0-brightgreen?style=flat-square)](https://mvnrepository.com/artifact/com.google.firebase/firebase-bom/26.8.0)
        -   [![com.google.android.material:material](https://img.shields.io/badge/com.google.android.material%3Amaterial-1.3.0-brightgreen?style=flat-square)](https://mvnrepository.com/artifact/com.google.android.material/material/1.3.0)
        -   [![com.google.android.gms:play-services-auth](https://img.shields.io/badge/com.google.android.gms%3Aplay--services--auth-19.0.0-brightgreen?style=flat-square)](https://mvnrepository.com/artifact/com.google.android.gms/play-services-auth/19.0.0)
        -   [![com.google.firebase:firebase-auth](https://img.shields.io/badge/com.google.firebase%3Afirebase--auth-20.0.3-brightgreen?style=flat-square)](https://mvnrepository.com/artifact/com.google.firebase/firebase-auth/20.0.3)
        -   [![com.google.firebase:firebase-firestore](https://img.shields.io/badge/com.google.firebase%3Afirebase--firestore-22.1.2-brightgreen?style=flat-square)](https://mvnrepository.com/artifact/com.google.firebase/firebase-firestore/22.1.2)
        -   [![androidx.appcompat:appcompat](https://img.shields.io/badge/androidx.appcompat%3Aappcompat-1.2.0-brightgreen?style=flat-square)](https://mvnrepository.com/artifact/androidx.appcompat/appcompat/1.2.0)
        -   [![androidx.fragment:fragment](https://img.shields.io/badge/androidx.fragment%3Afragment-1.3.2-brightgreen?style=flat-square)](https://mvnrepository.com/artifact/androidx.fragment/fragment/1.3.2)
        -   [![androidx.constraintlayout:constraintlayout](https://img.shields.io/badge/androidx.constraintlayout%3Aconstraintlayout-2.0.4-brightgreen?style=flat-square)](https://mvnrepository.com/artifact/androidx.constraintlayout/constraintlayout/2.0.4)
        -   [![androidx.legacy:legacy-support-v4](https://img.shields.io/badge/androidx.legacy%3Alegacy--support--v4-1.0.0-brightgreen?style=flat-square)](https://mvnrepository.com/artifact/androidx.legacy/legacy-support-v4/1.0.0)
        -   [![androidx.test.ext:junit](https://img.shields.io/badge/androidx.test.ext%3Ajunit-1.1.2-brightgreen?style=flat-square)](https://mvnrepository.com/artifact/androidx.test.ext/junit/1.1.2)
        -   [![androidx.test.espresso:espresso-core](https://img.shields.io/badge/androidx.test.espresso%3Aespresso--core-3.3.0-brightgreen?style=flat-square)](https://mvnrepository.com/artifact/androidx.test.espresso/espresso-core/3.3.0)
    -   Glide
        -   [![com.github.bumptech.glide:glide](https://img.shields.io/badge/com.github.bumptech.glide%3Aglide-4.12.0-brightgreen?style=flat-square)](https://mvnrepository.com/artifact/com.github.bumptech.glide/glide/4.12.0)
        -   [![com.github.bumptech.glide:compiler](https://img.shields.io/badge/com.github.bumptech.glide%3Acompiler-4.12.0-brightgreen?style=flat-square)](https://mvnrepository.com/artifact/com.github.bumptech.glide/compiler/4.12.0)
-   Android v2
    -   Android
        -   [![androidx.core:core-ktx](https://img.shields.io/badge/androidx.core%3Acore--ktx-1.6.0-brightgreen?style=flat-square)](https://mvnrepository.com/artifact/androidx.core/core-ktx/1.6.0)
        -   [![androidx.appcompat:appcompat](https://img.shields.io/badge/androidx.appcompat%3Aappcompat-1.3.1-brightgreen?style=flat-square)](https://mvnrepository.com/artifact/androidx.appcompat/appcompat/1.3.1)
        -   [![com.google.android.material:material](https://img.shields.io/badge/com.google.android.material%3Amaterial-1.4.0-brightgreen?style=flat-square)](https://mvnrepository.com/artifact/com.google.android.material/material/1.4.0)
        -   [![androidx.annotation:annotation](https://img.shields.io/badge/androidx.annotation%3Aannotation-1.2.0-brightgreen?style=flat-square)](https://mvnrepository.com/artifact/androidx.annotation/annotation/1.2.0)
        -   [![androidx.constraintlayout:constraintlayout](https://img.shields.io/badge/androidx.constraintlayout%3Aconstraintlayout-2.1.0-brightgreen?style=flat-square)](https://mvnrepository.com/artifact/androidx.constraintlayout/constraintlayout/2.1.0)
        -   [![androidx.lifecycle:lifecycle-livedata-ktx](https://img.shields.io/badge/androidx.lifecycle%3Alifecycle--livedata--ktx-2.3.1-brightgreen?style=flat-square)](https://mvnrepository.com/artifact/androidx.lifecycle/lifecycle-livedata-ktx/2.3.1)
        -   [![androidx.lifecycle:lifecycle-viewmodel-ktx](https://img.shields.io/badge/androidx.lifecycle%3Alifecycle--viewmodel--ktx-2.3.1-brightgreen?style=flat-square)](https://mvnrepository.com/artifact/androidx.lifecycle/lifecycle-viewmodel-ktx/2.3.1)
        -   [![com.google.firebase:firebase-auth](https://img.shields.io/badge/com.google.firebase%3Afirebase--auth-21.0.1-brightgreen?style=flat-square)](https://mvnrepository.com/artifact/com.google.firebase/firebase-auth/21.0.1)
        -   [![com.google.firebase:firebase-firestore-ktx](https://img.shields.io/badge/com.google.firebase%3Afirebase--firestore--ktx-23.0.3-brightgreen?style=flat-square)](https://mvnrepository.com/artifact/com.google.firebase/firebase-firestore-ktx/23.0.3)
        -   [![androidx.navigation:navigation-fragment-ktx](https://img.shields.io/badge/androidx.navigation%3Anavigation--fragment--ktx-2.3.5-brightgreen?style=flat-square)](https://mvnrepository.com/artifact/androidx.navigation/navigation-fragment-ktx/2.3.5)
        -   [![androidx.legacy:legacy-support-v4](https://img.shields.io/badge/androidx.legacy%3Alegacy--support--v4-1.0.0-brightgreen?style=flat-square)](https://mvnrepository.com/artifact/androidx.legacy/legacy-support-v4/1.0.0)
        -   [![androidx.navigation:navigation-fragment-ktx](https://img.shields.io/badge/androidx.navigation%3Anavigation--fragment--ktx-2.3.5-brightgreen?style=flat-square)](https://mvnrepository.com/artifact/androidx.navigation/navigation-fragment-ktx/2.3.5)
        -   [![androidx.navigation:navigation-ui-ktx](https://img.shields.io/badge/androidx.navigation%3Anavigation--ui--ktx-2.3.5-brightgreen?style=flat-square)](https://mvnrepository.com/artifact/androidx.navigation/navigation-ui-ktx/2.3.5)
        -   [![com.google.firebase:firebase-storage](https://img.shields.io/badge/com.google.firebase%3Afirebase--storage-20.0.0-brightgreen?style=flat-square)](https://mvnrepository.com/artifact/com.google.firebase/firebase-storage/20.0.0)
        -   [![junit:junit](https://img.shields.io/badge/junit%3Ajunit-4.13.2-brightgreen?style=flat-square)](https://mvnrepository.com/artifact/junit/junit/4.13.2)
        -   [![androidx.test.ext:junit](https://img.shields.io/badge/androidx.test.ext%3Ajunit-1.1.3-brightgreen?style=flat-square)](https://mvnrepository.com/artifact/androidx.test.ext/junit/1.1.3)
        -   [![androidx.test.espresso:espresso-core](https://img.shields.io/badge/androidx.test.espresso%3Aespresso--core-3.4.0-brightgreen?style=flat-square)](https://mvnrepository.com/artifact/androidx.test.espresso/espresso-core/3.4.0)
    -   Glide
        -   [![com.github.bumptech.glide:glide](https://img.shields.io/badge/com.github.bumptech.glide%3Aglide-4.12.0-brightgreen?style=flat-square)](https://mvnrepository.com/artifact/com.github.bumptech.glide/glide/4.12.0)
        -   [![com.github.bumptech.glide:compiler](https://img.shields.io/badge/com.github.bumptech.glide%3Acompiler-4.12.0-brightgreen?style=flat-square)](https://mvnrepository.com/artifact/com.github.bumptech.glide/compiler/4.12.0)
-   ChatBubble Server
    -   Cloud SDKs
        -   [![cloudinary](https://img.shields.io/badge/cloudinary-%5E1.21.0-red?style=flat-square)](https://npmjs.com/package/cloudinary/v/1.21.0)
        -   [![mongodb](https://img.shields.io/badge/mongodb-%5E3.5.7-red?style=flat-square)](https://npmjs.com/package/mongodb/v/3.5.7)
    -   Miscellaneous
        -   [![bcryptjs](https://img.shields.io/badge/bcryptjs-%5E2.4.3-red?style=flat-square)](https://npmjs.com/package/bcryptjs/v/2.4.3)
        -   [![colors](https://img.shields.io/badge/colors-%5E1.4.0-red?style=flat-square)](https://npmjs.com/package/colors/v/1.4.0)
        -   [![concurrently](https://img.shields.io/badge/concurrently-%5E5.2.0-red?style=flat-square)](https://npmjs.com/package/concurrently/v/5.2.0)
        -   [![config](https://img.shields.io/badge/config-%5E3.3.1-red?style=flat-square)](https://npmjs.com/package/config/v/3.3.1)
        -   [![express](https://img.shields.io/badge/express-%5E4.17.1-red?style=flat-square)](https://npmjs.com/package/express/v/4.17.1)
        -   [![jsonwebtoken](https://img.shields.io/badge/jsonwebtoken-%5E8.5.1-red?style=flat-square)](https://npmjs.com/package/jsonwebtoken/v/8.5.1)
        -   [![nodemailer](https://img.shields.io/badge/nodemailer-%5E6.4.6-red?style=flat-square)](https://npmjs.com/package/nodemailer/v/6.4.6)
        -   [![nodemon](https://img.shields.io/badge/nodemon-%5E2.0.3-red?style=flat-square)](https://npmjs.com/package/nodemon/v/2.0.3)
        -   [![socket.io](https://img.shields.io/badge/socket.io-%5E2.3.0-red?style=flat-square)](https://npmjs.com/package/socket.io/v/2.3.0)
-   ChatBubble Client
    -   React
        -   [![react](https://img.shields.io/badge/react-%5E16.13.1-red?style=flat-square)](https://npmjs.com/package/react/v/16.13.1)
        -   [![react-dom](https://img.shields.io/badge/react--dom-%5E16.13.1-red?style=flat-square)](https://npmjs.com/package/react-dom/v/16.13.1)
        -   [![react-router-dom](https://img.shields.io/badge/react--router--dom-%5E5.1.2-red?style=flat-square)](https://npmjs.com/package/react-router-dom/v/5.1.2)
        -   [![react-scripts](https://img.shields.io/badge/react--scripts-3.4.1-red?style=flat-square)](https://npmjs.com/package/react-scripts/v/3.4.1)
    -   Redux
        -   [![react-redux](https://img.shields.io/badge/react--redux-%5E7.2.0-red?style=flat-square)](https://npmjs.com/package/react-redux/v/7.2.0)
        -   [![redux](https://img.shields.io/badge/redux-%5E4.0.5-red?style=flat-square)](https://npmjs.com/package/redux/v/4.0.5)
        -   [![redux-devtools-extension](https://img.shields.io/badge/redux--devtools--extension-%5E2.13.8-red?style=flat-square)](https://npmjs.com/package/redux-devtools-extension/v/2.13.8)
        -   [![redux-thunk](https://img.shields.io/badge/redux--thunk-%5E2.3.0-red?style=flat-square)](https://npmjs.com/package/redux-thunk/v/2.3.0)
    -   Animations
        -   [![animate.css](https://img.shields.io/badge/animate.css-%5E4.1.0-red?style=flat-square)](https://npmjs.com/package/animate.css/v/4.1.0)
        -   [![aos](https://img.shields.io/badge/aos-%5E2.3.4-red?style=flat-square)](https://npmjs.com/package/aos/v/2.3.4)
        -   [![react-transition-group](https://img.shields.io/badge/react--transition--group-%5E4.4.1-red?style=flat-square)](https://npmjs.com/package/react-transition-group/v/4.4.1)
    -   Fonts
        -   [![@fortawesome/fontawesome-free](https://img.shields.io/badge/%40fortawesome%2Ffontawesome--free-%5E5.13.1-red?style=flat-square)](https://npmjs.com/package/@fortawesome/fontawesome-free/v/5.13.1)
        -   [![font-awesome](https://img.shields.io/badge/font--awesome-%5E4.7.0-red?style=flat-square)](https://npmjs.com/package/font-awesome/v/4.7.0)
    -   Miscellaneous
        -   [![axios](https://img.shields.io/badge/axios-%5E0.19.2-red?style=flat-square)](https://npmjs.com/package/axios/v/0.19.2)
        -   [![bootstrap](https://img.shields.io/badge/bootstrap-%5E4.5.0-red?style=flat-square)](https://npmjs.com/package/bootstrap/v/4.5.0)
        -   [![jquery](https://img.shields.io/badge/jquery-%5E3.5.1-red?style=flat-square)](https://npmjs.com/package/jquery/v/3.5.1)
        -   [![popper.js](https://img.shields.io/badge/popper.js-%5E1.16.1-red?style=flat-square)](https://npmjs.com/package/popper.js/v/1.16.1)
        -   [![reactstrap](https://img.shields.io/badge/reactstrap-%5E8.4.1-red?style=flat-square)](https://npmjs.com/package/reactstrap/v/8.4.1)
        -   [![socket.io-client](https://img.shields.io/badge/socket.io--client-%5E2.3.0-red?style=flat-square)](https://npmjs.com/package/socket.io-client/v/2.3.0)
-   Express
    -   TypeScript
        -   [![ts-node](https://img.shields.io/badge/ts--node-%5E10.7.0-red?style=flat-square)](https://npmjs.com/package/ts-node/v/10.7.0)
        -   [![typescript](https://img.shields.io/badge/typescript-%5E4.6.3-red?style=flat-square)](https://npmjs.com/package/typescript/v/4.6.3)
    -   Miscellaneous
        -   [![dotenv](https://img.shields.io/badge/dotenv-%5E16.0.0-red?style=flat-square)](https://npmjs.com/package/dotenv/v/16.0.0)
        -   [![firebase-admin](https://img.shields.io/badge/firebase--admin-%5E10.0.2-red?style=flat-square)](https://npmjs.com/package/firebase-admin/v/10.0.2)
-   React
    -   TypeScript
        -   [![@types/luxon](https://img.shields.io/badge/%40types%2Fluxon-%5E2.3.1-red?style=flat-square)](https://npmjs.com/package/@types/luxon/v/2.3.1)
        -   [![@types/react](https://img.shields.io/badge/%40types%2Freact-%5E17.0.33-red?style=flat-square)](https://npmjs.com/package/@types/react/v/17.0.33)
        -   [![@types/react-dom](https://img.shields.io/badge/%40types%2Freact--dom-%5E17.0.10-red?style=flat-square)](https://npmjs.com/package/@types/react-dom/v/17.0.10)
        -   [![@types/react-redux](https://img.shields.io/badge/%40types%2Freact--redux-%5E7.1.24-red?style=flat-square)](https://npmjs.com/package/@types/react-redux/v/7.1.24)
        -   [![typescript](https://img.shields.io/badge/typescript-%5E4.5.4-red?style=flat-square)](https://npmjs.com/package/typescript/v/4.5.4)
    -   React
        -   [![@babel/core](https://img.shields.io/badge/%40babel%2Fcore-%5E7.17.8-red?style=flat-square)](https://npmjs.com/package/@babel/core/v/7.17.8)
        -   [![react](https://img.shields.io/badge/react-%5E17.0.2-red?style=flat-square)](https://npmjs.com/package/react/v/17.0.2)
        -   [![react-dom](https://img.shields.io/badge/react--dom-%5E17.0.2-red?style=flat-square)](https://npmjs.com/package/react-dom/v/17.0.2)
        -   [![react-router-dom](https://img.shields.io/badge/react--router--dom-%5E6.3.0-red?style=flat-square)](https://npmjs.com/package/react-router-dom/v/6.3.0)
    -   Material UI
        -   [![@emotion/react](https://img.shields.io/badge/%40emotion%2Freact-%5E11.8.2-red?style=flat-square)](https://npmjs.com/package/@emotion/react/v/11.8.2)
        -   [![@emotion/styled](https://img.shields.io/badge/%40emotion%2Fstyled-%5E11.8.1-red?style=flat-square)](https://npmjs.com/package/@emotion/styled/v/11.8.1)
        -   [![@mui/icons-material](https://img.shields.io/badge/%40mui%2Ficons--material-%5E5.5.1-red?style=flat-square)](https://npmjs.com/package/@mui/icons-material/v/5.5.1)
        -   [![@mui/material](https://img.shields.io/badge/%40mui%2Fmaterial-%5E5.5.3-red?style=flat-square)](https://npmjs.com/package/@mui/material/v/5.5.3)
        -   [![framer-motion](https://img.shields.io/badge/framer--motion-%5E6.2.8-red?style=flat-square)](https://npmjs.com/package/framer-motion/v/6.2.8)
        -   [![notistack](https://img.shields.io/badge/notistack-%5E2.0.4-red?style=flat-square)](https://npmjs.com/package/notistack/v/2.0.4)
    -   Redux
        -   [![@reduxjs/toolkit](https://img.shields.io/badge/%40reduxjs%2Ftoolkit-%5E1.8.1-red?style=flat-square)](https://npmjs.com/package/@reduxjs/toolkit/v/1.8.1)
        -   [![react-redux](https://img.shields.io/badge/react--redux-%5E8.0.0-red?style=flat-square)](https://npmjs.com/package/react-redux/v/8.0.0)
    -   Vite
        -   [![@vitejs/plugin-react](https://img.shields.io/badge/%40vitejs%2Fplugin--react-%5E1.0.7-red?style=flat-square)](https://npmjs.com/package/@vitejs/plugin-react/v/1.0.7)
        -   [![vite](https://img.shields.io/badge/vite-%5E2.9.0-red?style=flat-square)](https://npmjs.com/package/vite/v/2.9.0)
    -   Miscellaneous
        -   [![fast-deep-equal](https://img.shields.io/badge/fast--deep--equal-%5E3.1.3-red?style=flat-square)](https://npmjs.com/package/fast-deep-equal/v/3.1.3)
        -   [![firebase](https://img.shields.io/badge/firebase-%5E9.6.10-red?style=flat-square)](https://npmjs.com/package/firebase/v/9.6.10)
        -   [![luxon](https://img.shields.io/badge/luxon-%5E2.3.1-red?style=flat-square)](https://npmjs.com/package/luxon/v/2.3.1)
        -   [![react-audio-player](https://img.shields.io/badge/react--audio--player-%5E0.17.0-red?style=flat-square)](https://npmjs.com/package/react-audio-player/v/0.17.0)
        -   [![react-firebase-hooks](https://img.shields.io/badge/react--firebase--hooks-%5E5.0.3-red?style=flat-square)](https://npmjs.com/package/react-firebase-hooks/v/5.0.3)
        -   [![react-infinite-scroll-component](https://img.shields.io/badge/react--infinite--scroll--component-%5E6.1.0-red?style=flat-square)](https://npmjs.com/package/react-infinite-scroll-component/v/6.1.0)
        -   [![react-player](https://img.shields.io/badge/react--player-%5E2.10.0-red?style=flat-square)](https://npmjs.com/package/react-player/v/2.10.0)