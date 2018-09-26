import { createAction, handleActions } from 'redux-actions';
import firestore from './Firestore';
import dateFormat from 'dateformat';


// action type
const BOARD_SAVE = 'SAVE';
const BOARD_REMOVE = 'REMOVE';
const BOARD_READ = 'READ';
const BOARD_LIST = 'LIST'; 

export const board_save = createAction(BOARD_SAVE);
export const board_remove = createAction(BOARD_REMOVE, brdno => brdno);
export const board_read = createAction(BOARD_READ);
export const board_list = createAction(BOARD_LIST);

export const firebase_board_list = () =>{
	return (dispatch) => {
		return firestore.collection('board').orderBy("brddate", "desc").get()
					.then((snapshot) => {
						var rows = [];
						snapshot.forEach((doc) => {
							var childData = doc.data();
							childData.brddate = dateFormat(childData.brddate, "yyyy-mm-dd");
							rows.push(childData);
						});
						dispatch(board_list(rows));
					});	
	}
}

export const firebase_board_remove = ( brdno = {}) => {
    return (dispatch) => {
		console.log(brdno);
        return firestore.collection('board').doc(brdno).delete().then(() => {
            dispatch(board_remove(brdno));
        })
    }
};

export const firebase_board_save = ( data = {}) => {
    return (dispatch) => {
		if (!data.brdno) {
			var doc = firestore.collection("board").doc();
			data.brdno = doc.id;
			data.brddate = Date.now();
			return doc.set(data).then(() => {
				data.brddate = dateFormat(data.brddate, "yyyy-mm-dd");
				dispatch(board_save(data));
			})
		} else {
			return firestore.collection('board').doc(data.brdno).update(data).then(() => {
				dispatch(board_save(data));
			})			
		}
    }
};

const initialState = {
	boards: [],
	selectedBoard: {}
};

export default handleActions({
	[BOARD_LIST]: (state, { payload: data }) => {
		return {boards: data, selectedBoard: {} };
	},
	[BOARD_SAVE]: (state, { payload: data }) => {
		let boards = state.boards;
		let inx = boards.findIndex(row => row.brdno === data.brdno);
		console.log(inx);
		console.log(data);
		if (inx===-1) {	// new : Insert
			return {boards: boards.concat({date: new Date(), ...data }), selectedBoard: {} };
		} else {														// Update
			return {boards: boards.map(row => data.brdno === row.brdno ? {...data }: row), selectedBoard: {} };
		}	
	},
	[BOARD_REMOVE]: (state, { payload: brdno }) => {
		let boards = state.boards;
		return {boards: boards.filter(row => row.brdno !== brdno), selectedBoard: {} };
	},
	[BOARD_READ]: (state, { payload: brdno }) => {
		let boards = state.boards;
		return {
			boards: boards,
			selectedBoard: boards.find(row => row.brdno === brdno)
		};
	}
}, initialState);
