import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import moment from 'moment';
import DatePicker from 'react-date-picker';
import TimePicker from 'rc-time-picker';
import { Button, Modal, FormGroup, FormControl, Row, Grid, Col } from 'react-bootstrap';
import { Link } from 'react-router';

import RoomsCollection from '../../../../api/collections/rooms.js';
import CustomersCollection from '../../../../api/collections/customers.js';

import CustomerRow from '../customers/CustomerRow';
import Preloader from '../../../shared/preloader/Preloader';

import 'rc-time-picker/assets/index.css';

const defaultStart = moment().add(15 - (moment().minute() % 15), "minutes");
const defaultEnd = moment().add(15 - (moment().minute() % 15), "minutes").add(3, "hours");
const duration = moment.duration(defaultEnd.diff(defaultStart));
const days = (parseInt(duration.asDays()) == 0) ? '' : `${parseInt(duration.asDays())}d `;
const hours = ((parseInt(duration.asHours()) % 24) == 0) ? '' : `${parseInt(duration.asHours()) % 24}h `;
const minutes = ((parseInt(duration.asMinutes()) % 60) == 0) ? '' : `${parseInt(duration.asMinutes()) % 60}m `;
const defaultBookingLength = days + hours + minutes;

class BookingForm extends Component {

	state = {
		modal: 0,
		startDate: defaultStart,
		endDate: defaultEnd,
		startTime: defaultStart,
		endTime: defaultEnd,
		startDateTime: defaultStart,
		endDateTime: defaultEnd,
		bookingLength: defaultBookingLength,
		comment: '',
		customerId: '',
		customerName: ''
	}

	componentDidUpdate(prevProps) {
		// Set first customer as default
		if (this.props.customers !== prevProps.customers) {
			if (this.props.customers[0]) {
				this.setState({
					customerId: this.props.customers[0]._id,
					customerName: this.props.customers[0].name
				});
			} else {
				this.setState({
					// Open "add invoice receiver dialog"
					modal: 2
				});
			}
		};
	}

	openQueue() {
		// The date picker calendar opens outside of view if not scrolled to top
		window.scrollTo(0, 0);
		this.setState({modal: 1});
	}

	handleClose() {
		this.setState({modal: 0});
	}

	changeStartDate(date) {
		this.setState({ 
			startDate: moment(date) 
		},
			this.validateDateTime
		);
	}

	cangeStartTime(time) {
		this.setState({
			startTime: time
		},
			this.validateDateTime
		);
	}

	changeEndDate(date) {
		this.setState({ 
			endDate: moment(date)
		},
			this.validateDateTime
		);
	}

	cangeEndTime(time) {
		this.setState({
			endTime: time
		},
			this.validateDateTime
		);
	}

	validateDateTime() {
		// Do validation here in the future if needed
		const startDate = this.state.startDate.format('DD/MM/YYYY');
		const endDate = this.state.endDate.format('DD/MM/YYYY');
		const startTime = this.state.startTime.format('HH:mm');
		const endTime = this.state.endTime.format('HH:mm');

		const startDateTime = moment(startDate + " " + startTime, 'DD/MM/YYYY HH:mm');
		const endDateTime = moment(endDate + " " + endTime, 'DD/MM/YYYY HH:mm');

		this.setState({
			startDateTime,
			endDateTime
		},
			this.setBookingDuration
		);
	}

	setBookingDuration() {
		const duration = moment.duration(this.state.endDateTime.diff(this.state.startDateTime));
		const days = (parseInt(duration.asDays()) == 0) ? '' : `${parseInt(duration.asDays())}d `;
		const hours = ((parseInt(duration.asHours()) % 24) == 0) ? '' : `${parseInt(duration.asHours()) % 24}h `;
		const minutes = ((parseInt(duration.asMinutes()) % 60) == 0) ? '' : `${parseInt(duration.asMinutes()) % 60}m `;
		const bookingLength = days + hours + minutes;

		this.setState({
			bookingLength
		});
	}

	changeComment(comment) {
		this.setState({
			comment: comment.target.value
		});
	}

	chooseCustomer(customer) {
		if (customer.roomBookingAgreements) {
			customer.roomBookingAgreements.map((agreement) => {
				if (agreement.roomId == this.props.currentRoom) {
					this.setState({
						customerId: customer._id,
						customerName: customer.name
					});
				} else {
					Bert.alert("That customer can't book this room", 'danger', 'growl-bottom-right', 'fa-frown-o');
				}
			});
		} else {
			Bert.alert("That customer can't book this room", 'danger', 'growl-bottom-right', 'fa-frown-o');
		}
	}

	doBooking() {

		const startDateTime = this.state.startDateTime;
		const endDateTime = this.state.endDateTime;
		const customerId = this.state.customerId;
		const roomId = this.props.currentRoom;
		const comment = this.state.comment;

		if (endDateTime.isSameOrBefore(startDateTime)) {
			Bert.alert("End time cannot be same as or before start time", 'danger', 'growl-bottom-right', 'fa-frown-o');
			return;
		}

		if (customerId == '') {
			Bert.alert("You have to add an invoice receiver before booking", 'danger', 'growl-bottom-right', 'fa-frown-o');
		}

		if (roomId == '') {
			Bert.alert("You have to choose a room first", 'danger', 'growl-bottom-right', 'fa-frown-o');
		}

		const payload = {
			customerId: customerId,
			roomId: roomId,
			from: startDateTime.toDate(),
			to: endDateTime.toDate(),
			comment: this.state.comment
		};

		this.props.onSubmit(payload);

		this.setState({
			modal: 0,
			startDate: defaultStart,
			endDate: defaultEnd,
			startTime: defaultStart,
			endTime: defaultEnd,
			startDateTime: defaultStart,
			endDateTime: defaultEnd,
			bookingLength: defaultBookingLength,
			comment: ''
		});
	}

	render() {

		if (this.props.loading) {
			return null;
		}

		const user = this.props.user;
		const customers = this.props.customers;
		const addCustomerUrl = '/secure/addCustomer/' + Meteor.userId();

		const BookingButton = 
				<div
					style={{
						position: 'fixed',
						'zIndex': '1',
						bottom: '20px',
						right: '20px'
					}}
				>
					<Button bsStyle="success" bsSize="large" disabled={customers.length == 0} onClick={this.openQueue.bind(this)}>Book {this.props.currentRoomName}</Button>
				</div>;

		const customersSelector = 
			(customers.length < 2) ?
				<span></span> :
				<div>
					<hr />
					<p>Choose invoice receiver:</p>
					{customers.map((customer) => {
						const active = (customer._id == this.state.customerId) ? {color: 'rgb(38, 84, 249)'} : {};
						return (
							<div style={active} key={customer._id}>
								<CustomerRow customer={customer} onClick={this.chooseCustomer.bind(this, customer)} />
							</div>
						);
					})}
				</div>

		return (
			<div>
				<div>
					{BookingButton}
				</div>

				<Modal show={this.state.modal == 2}>
					<Modal.Header>Add invoice receiver</Modal.Header>
					<Modal.Body>
						<p><Link to={addCustomerUrl} style={{color: 'rgb(38, 84, 249)'}}>Add invoice reveicer</Link> before you can book.</p>
					</Modal.Body>
				</Modal>

				<Modal show={this.state.modal == 1} onHide={this.handleClose.bind(this)}>
					<Modal.Header closeButton>
						<Modal.Title>Book {this.props.currentRoomName}</Modal.Title>
						<Modal.Body style={{padding: 0}}>
							<hr />
							<div className="row">
								<div className="col-xs-4">
									<p>From:</p>
								</div>
								<div className="col-xs-8">
									<DatePicker
										onChange={this.changeStartDate.bind(this)}
										value={this.state.startDate.toDate()}
										locale='no-nb'
									/>
								</div>
								<div className="col-xs-8">
									<TimePicker 
										value={this.state.startTime} 
										showSecond={false}
										allowEmpty={false}
										minuteStep={15}
										onChange={this.cangeStartTime.bind(this)}
									/>
								</div>
							</div>

							<hr />

							<div className="row">
								<div className="col-xs-4">
									<p>To:</p>
								</div>
								<div className="col-xs-8">
									<DatePicker
										onChange={this.changeEndDate.bind(this)}
										value={this.state.endDate.toDate()}
										locale='no-nb'
									/>
								</div>
								<div className="col-xs-8">
									<TimePicker 
										value={this.state.endTime} 
										showSecond={false}
										allowEmpty={false}
										minuteStep={15}
										onChange={this.cangeEndTime.bind(this)}
									/>
								</div>
							</div>

							<hr />

							<p>Description:</p>

							<form>
								<FormGroup>
									<FormControl
										type="text"
										value={this.state.comment}
										placeholder="Bandøving med DDE ..."
										onChange={this.changeComment.bind(this)}
									/>
								</FormGroup>
							</form>

							{customersSelector}

							<hr />
							<p>The invoice will be sendt to {this.state.customerName}, you can add more invoice receivers from your <Link to="/secure/profile" style={{color: 'rgb(38, 84, 249)'}}>profile</Link> :)</p>

							<hr />

							<Button 
								onClick={this.doBooking.bind(this)}
								bsStyle="success" 
								bsSize="large" 
								block
							>Book {this.state.bookingLength}
							</Button>

						</Modal.Body>
						<Modal.Footer>
							<Button onClick={this.handleClose.bind(this)}>Close</Button>
						</Modal.Footer>
					</Modal.Header>
				</Modal>

			</div>
		);
	}
}

export default withTracker(() => {
	const customersHandle = Meteor.subscribe('userCustomers');
	const profileHandle = Meteor.subscribe('profile');

	const loading = !customersHandle.ready() && !profileHandle.ready();

	return {
		loading,
		user: Meteor.users.find().fetch()[0],
		customers: CustomersCollection.find().fetch()
	};
})(BookingForm);