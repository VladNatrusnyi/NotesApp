import {
    StyleSheet, TextInput,
} from "react-native";
import React, { useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {COLORS} from "../helpers/colors";
import {MainBtn} from "../components/MainBtn";
import {AddAuthBlock} from "../components/AddAuthBlock";
import {isValidEmail} from "../helpers/validations";
import {setAuthIsLoading, setCurrentUser} from "../store/auth/authSlice";
import {auth} from "../../config/firebase";
import {createUserWithEmailAndPassword, updateProfile} from "firebase/auth";
import {AuthLayout} from "../lauouts/AuthLayout";
import {InputLayout} from "../lauouts/InputLayout";
import {ErrorBlock} from "../components/ErrorBlock";

export const SignUpPage = ({ navigation }) => {
    const dispatch = useDispatch()
    const [emailText, setEmailText] = useState('');
    const [passwordText, setPasswordText] = useState('');
    const [nicknameText, setNicknameText] = useState('');

    const {isLoading} = useSelector(state => state.auth)

    const [isEmailValidError, setIsEmailValidError] = useState(false)

    const [signupErrorText, setSingupErrorText] = useState('')

    const disabled = useMemo(() => {
        return !nicknameText.trim() || !emailText.trim() || !passwordText.trim() || passwordText.length < 6
    }, [emailText, passwordText, nicknameText])

    const [nicknameOnFocus, setNicknameOnFocus] = useState(false)
    const [emailOnFocus, setEmailOnFocus] = useState(false)
    const [passwordOnFocus, setPasswordOnFocus] = useState(false)

    const Signup = () => {
        if (isValidEmail(emailText)) {
            setIsEmailValidError(false)
            dispatch(setAuthIsLoading(true))

            createUserWithEmailAndPassword(auth, emailText, passwordText)
                .then((userCredential) => {
                    const userData = userCredential.user;
                    setSingupErrorText('')

                    updateProfile(userData, { displayName: nicknameText })
                        .then(() => {
                            const data = {
                                email: userData.email,
                                displayName: nicknameText,
                                uid: userData.uid,
                            }

                            dispatch(setCurrentUser(data))

                            dispatch(setAuthIsLoading(false))
                            setSingupErrorText('')
                        })
                        .catch((error) => {
                            dispatch(setAuthIsLoading(false))
                            console.error('Error updating user profile', error.message);
                            setSingupErrorText(error.message)
                        });


                })
                .catch((error) => {
                    const errorMessage = error.message;
                    dispatch(setAuthIsLoading(false))
                    setSingupErrorText(errorMessage)
                    console.log('ERROR Registered user in auth', errorMessage)
                });


        } else {
            setIsEmailValidError(true)
        }
    };

    return (
        <AuthLayout title={'Sign Up'}>

            <InputLayout onFocus={nicknameOnFocus}>
                <TextInput
                    placeholderTextColor={COLORS.disabled}
                    style={styles.textInput}
                    placeholder="Enter nickname"
                    autoCapitalize="none"
                    textContentType="nickname"
                    autoFocus={true}
                    value={nicknameText}
                    onChangeText={(text) => setNicknameText(text)}
                    onFocus={() => setNicknameOnFocus(true)}
                    onBlur={() => setNicknameOnFocus(false)}
                />
            </InputLayout>


            <InputLayout onFocus={emailOnFocus}>
                <TextInput
                    placeholderTextColor={COLORS.disabled}
                    style={styles.textInput}
                    placeholder="Enter email"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    textContentType="emailAddress"
                    value={emailText}
                    onChangeText={(text) => setEmailText(text)}
                    onFocus={() => setEmailOnFocus(true)}
                    onBlur={() => setEmailOnFocus(false)}
                />
            </InputLayout>


            <InputLayout onFocus={passwordOnFocus}>
                <TextInput
                    placeholderTextColor={COLORS.disabled}
                    style={styles.textInput}
                    placeholder="Enter password"
                    autoCapitalize="none"
                    autoCorrect={false}
                    textContentType="password"
                    value={passwordText}
                    onChangeText={(text) => setPasswordText(text)}
                    onFocus={() => setPasswordOnFocus(true)}
                    onBlur={() => setPasswordOnFocus(false)}
                />
            </InputLayout>


            <MainBtn
                onPress={Signup}
                text={'Sign Up'}
                isLoading={isLoading}
                disabled={disabled}
            />


            <ErrorBlock isErrorMessage={isEmailValidError} message={'Email is not valid'} />

            <ErrorBlock isErrorMessage={signupErrorText} />


            <AddAuthBlock
                text={'If you have an account'}
                linkText={'Log In'}
                onPressLink={() => navigation.navigate("Login")}
            />
        </AuthLayout>
    );
}

const styles = StyleSheet.create({
    textInput: {
        fontSize: 16,
        marginRight: 10,
        flex: 10,
        color: COLORS.lightText
    }
});
