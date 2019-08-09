const SAVE = "cache:SAVE";

export const reducer = (state = {}, {type, data}) => {
	switch (type) {
		case SAVE:
			return {...state, ...data};
		default:
			return state;
	}
};

export const save = data => ({type: SAVE, data});
