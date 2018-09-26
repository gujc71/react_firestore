import React, { Component } from 'react';
import { connect } from 'react-redux';

import { firebase_board_save } from './App_reducer'

class BoardForm extends Component {
	
	handleSubmit = (e) => {
		e.preventDefault();
		
		let data = {
			brdtitle: this.titleInput.value,
			brdwriter: this.nameInput.value
		}
		if (this.props.selectedBoard.brdno) {
			data.brdno = this.props.selectedBoard.brdno
			data.brddate = this.props.selectedBoard.brddate
		}

		this.props.dispatch(firebase_board_save(data));
	}
	
	shouldComponentUpdate(nextProps, nextState) {
		let  selectedBoard = nextProps.selectedBoard;
		if (!selectedBoard.brdno) {
			this.titleInput.value = "";
			this.nameInput.value = "";		
			return true;
		}
		
		this.titleInput.value = selectedBoard.brdtitle;
		this.nameInput.value = selectedBoard.brdwriter;		
		return true;
	}

	render() {
		return (
		
			<form onSubmit={this.handleSubmit}>
				<input placeholder="title" name="title" ref={node => this.titleInput = node}/>
				<input placeholder="name" name="name" ref={node => this.nameInput = node}/>
				<button type="submit">Save</button>
			</form>
		);
	}
}

let mapStateToProps = (state) => {
	return {
		selectedBoard: state.selectedBoard
	};
}
export default connect(mapStateToProps)(BoardForm);
