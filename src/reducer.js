import db from './firebase'


export const initialState = {
    user: null
};

export const actionTypes = {
    SET_USER:"SET_USER",
};

const reducer = (state, action) => {
    console.log("user:",action)
    switch(action.type){
        case actionTypes.SET_USER:
            db.collection('users').add({
                userInfo: action.user.displayName
            })
            return {...state, user: action.user,}
        default: return state;
    }
}

export default reducer;