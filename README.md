<!-- Improved compatibility of back to top link: See: https://github.com/TricksterLabs/TricksterWallet/pull/73 -->
<a name="readme-top"></a>
<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->



<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]


<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/TricksterLabs/TricksterWallet">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Trickster Wallet (0.0.6-alpha)</h3>

  <p align="center">
    Cardano Multi-Wallet Manager (Light and Full-Node options available)
    <br />
    <a href="https://github.com/TricksterLabs/TricksterWallet"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    ·
    <a href="https://github.com/TricksterLabs/TricksterWallet/issues">Report Bug</a>
    ·
    <a href="https://github.com/TricksterLabs/TricksterWallet/issues">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

[![Product Name Screen Shot][product-screenshot]](https://github.com/TricksterLabs/TricksterWallet)

Presenting you a Cardano Multi-Wallet Manager (Please note this is an alpha release, there will be breaking changes and many features are missing)

* The purpose of this software is to be an all encompassing solution to the world of Cardano
* Multi-Wallet asset viewer
* Send complex transactions from multiple wallets at the same time (with franken address support)
* Data analytics for each asset
* List/purchase/offer on market assets directly from your wallet
* Exchange tokens directly from your wallet
* Asset trading directly from your wallet
* Cardano mailing system & propose a new standard (via transaction metadata)
* ... more


<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With

* [![Vue][Vue.js]][Vue-url]
* Quasar Framework
* Koios API (for everyday tasks)
* OpenCNFT API (for market analytics)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

### Installation (for developers)

1. Clone the repo
   ```sh
   git clone https://github.com/TricksterLabs/TricksterWallet.git
   ```
2. Install Quasar CLI globally
   ```sh
   npm install -g @quasar/cli
   ```
3. Install NPM packages
   ```sh
   npm install
   ```
4. Build electron for all target systems
   ```js
   quasar build -m electron -T all
   ```
5. Development commands (please note to change /src/wallet/SendTX.js link to /api or you won't be able to send in dev mode)
   ```js
   quasar dev
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage

1. Extract the archive to a folder of choice
2. Open TricksterWallet.exe (or the extension required by your operating system)
3. On first open you will be prompted to "Set Password". This will be required for any sensitive operations you will do.
4. Type in your new password to get access to the app.
5. Click manage and either create or import wallets
6. Wallets should be populated on the left part of the screen, various options are presented when hovering over their respective buttons
7. The middle screen contains all of your assets and analytics about them to be able to manage them with ease.
8. To send a transaction with only ADA, initiate a transaction on the corresponding icon in front of your wallet.
9. To send assets, simply select them.
10. Currently, minimum value and fees are not shown to the user (this is an alpha release). Estimate that you need atleast 0.15-0.2 ADA per transaction as a fee and about 1.2 ADA for the first asset with an extra of 0.2 ADA for each additional asset you add (these are minimum utxo values)
11. Make sure to keep a backup of your keys somewhere safe, you can export newly created wallets in Manage > Export Wallets

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ROADMAP -->
## Roadmap

- [x] Add Changelog
- [ ] Add Roadmap

See the [open issues](https://github.com/TricksterLabs/TricksterWallet/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

TricksterLabs - [@TricksterLabs](https://twitter.com/TricksterLabs) - support@trickster.fi

Project Link: [https://github.com/TricksterLabs/TricksterWallet](https://github.com/TricksterLabs/TricksterWallet)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/TricksterLabs/TricksterWallet.svg?style=for-the-badge
[contributors-url]: https://github.com/TricksterLabs/TricksterWallet/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/TricksterLabs/TricksterWallet.svg?style=for-the-badge
[forks-url]: https://github.com/TricksterLabs/TricksterWallet/network/members
[stars-shield]: https://img.shields.io/github/stars/TricksterLabs/TricksterWallet.svg?style=for-the-badge
[stars-url]: https://github.com/TricksterLabs/TricksterWallet/stargazers
[issues-shield]: https://img.shields.io/github/issues/TricksterLabs/TricksterWallet.svg?style=for-the-badge
[issues-url]: https://github.com/TricksterLabs/TricksterWallet/issues
[license-shield]: https://img.shields.io/github/license/TricksterLabs/TricksterWallet.svg?style=for-the-badge
[license-url]: https://github.com/TricksterLabs/TricksterWallet/blob/master/LICENSE.txt
[product-screenshot]: images/screenshot.png
[Vue.js]: https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D
[Vue-url]: https://vuejs.org/
