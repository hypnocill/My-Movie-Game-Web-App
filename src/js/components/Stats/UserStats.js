import React 				from 'react';
import { browserHistory }	from 'react-router';
import { connect } 			from 'react-redux';
import RaisedButton 		from 'material-ui/RaisedButton';
import CircularProgress 	from 'material-ui/CircularProgress';

import * as actions 						from '../../actions/actions';
import firebase,  {firebaseRef, FBprovider} from '../../firebase/firebase';

class UserStats extends React.Component {
	startPlay()
	{
		browserHistory.push( '/redirect' );
	}

	componentDidMount()
	{
		let { dispatch }	= this.props;
		let auth			= firebase.auth().currentUser;
		firebaseRef.child('users/' + auth.uid ).once( 'value' ).then( ( snapshot ) =>
			{
				let userData	= snapshot.val();

				dispatch( actions.getUserData( userData ) );
			}, ( e ) =>
			{
				dispatch( actions.getUserData( e ) )
			}
		);
	}

timeConverter( timestamp )
{
	let a 		= new Date( timestamp );
	let months 	= ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
	let year 	= a.getFullYear();
	let month 	= months[a.getMonth()];
	let date 	= a.getDate();
	let hour 	= a.getHours();
	let min 	= a.getMinutes();
	let sec 	= a.getSeconds();
	let time 	= date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;

	return time;
}

	render()
	{
		let userData 		= this.props.userData ? this.props.userData : false ;
		let auth 			= firebase.auth().currentUser;
		let name 			= auth.displayName;
		let email 			= auth.email;
		let photoURL		= `http://graph.facebook.com/${auth.providerData[0].uid}/picture?type=square`
		let score			= userData.score;
		let registeredOn	= this.timeConverter(userData.registeredOn);

		let spinner		= <CircularProgress style={{'marginTop': '25px'}}/>;
		let userDataJSX	= <div>
							<img style={{'borderRadius': '50%'}} src={photoURL}></img>
							<h1>{name}</h1>
							<h2>Highest Score: {score} </h2>
							<p>
								First Play on: {registeredOn} <br />
							</p>
							<RaisedButton label="PLAY" secondary={true} onTouchTap={this.startPlay} />
							</div>;

		return(
			<div style={{'marginTop': '15px', 'marginBottom': '15px'}}>
					{userData ? userDataJSX : spinner}
			</div>
		);
	}
};

export default connect( ( state ) =>
	{
		return {
			userData: state.userData
		};
	}
)( UserStats );
