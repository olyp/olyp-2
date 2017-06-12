import React, { Component } from 'react';

class CustomerRoomAgreement extends Component {
	render () {

		console.log(this.props.params.roomId);
		console.log(this.props.params.customerId);

		return (
			<div></div>
		);
	}
}

export default CustomerRoomAgreement;