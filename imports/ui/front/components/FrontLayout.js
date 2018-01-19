import React, {Component} from 'react';
import { Helmet } from 'react-helmet';

// import Preloader from '../../shared/preloader/Preloader.js';

import NavBar from '../../shared/navigation/NavBar.js';
import NavBarDesktop from '../../shared/navigation/NavBarDesktop.js';
import Footer from './navigation/Footer.js';

// const schemaOrg = 
// <script type="application/ld+json"> {
// 	"@context": "http://schema.org",
// 	"@type": "Organization",
// 	"url": "https://olyp.no",
// 	"name": "Oslo Lydproduksjon (OLYP)",
//     "logo": "https://olyp.no/images/logo/logo-square.png",
//     "vatId": "912443760",
//     "address": {
//     	"@type": "PostalAddress",
//     	"addressCountry": "NO",
//         "postalCode": "0570",
//         "streetAddress": "Olaf Schous Vei 6 C",
//         "addressRegion": "Oslo",
//         "addressLocality": "Oslo"
//     },
// 	"contactPoint": {
// 		"@type": "ContactPoint",
// 		"telephone": "+47 41547798",
//         "email": "jonas@olyp.no",
//         "contactType": "Customer service"
// 	}
// } </script>
	

class FrontLayout extends Component {

	render() {

		const routeName = 'OLYP || ' + this.props.routes[this.props.routes.length - 1].name;

		return (
			<div>
				<Helmet>
					<title>{routeName}</title>
					<meta name="google-site-verification" content={Meteor.settings.public.googleSiteVerification} />
				</Helmet>
				<div className="mobile">
					<NavBar />
				</div>
				<div className="desktop">
					<NavBarDesktop />
				</div>
				{this.props.children}
				<Footer />
			</div>
		);
	}
}

export default FrontLayout;