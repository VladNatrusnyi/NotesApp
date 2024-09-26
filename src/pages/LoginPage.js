import {
    StyleSheet,
    TextInput,
} from "react-native";
import React, { useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {COLORS} from "../helpers/colors";
import {MainBtn} from "../components/MainBtn";
import {AddAuthBlock} from "../components/AddAuthBlock";
import {isValidEmail} from "../helpers/validations";
import {setAuthIsLoading} from "../store/auth/authSlice";
import {auth} from "../../config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import {AuthLayout} from "../lauouts/AuthLayout";
import {InputLayout} from "../lauouts/InputLayout";
import {ErrorBlock} from "../components/ErrorBlock";

export const LoginPage = ({ navigation }) => {
    const dispatch = useDispatch()

    const [emailText, setEmailText] = useState("");
    const [passwordText, setPasswordText] = useState("");

    const [isEmailValidError, setIsEmailValidError] = useState(false)
    const [loginErrorText, setLoginErrorText] = useState('')

    const {isLoading} = useSelector(state => state.auth)

    const isDisabled = useMemo(() => {
        return !emailText.trim() || !passwordText.trim() || passwordText.length < 6
    }, [emailText, passwordText])

    const [emailOnFocus, serEmailOnFocus] = useState(false)
    const [passwordOnFocus, serPasswordOnFocus] = useState(false)

    const Login = () => {
        if (isValidEmail(emailText)) {
            setIsEmailValidError(false)

            dispatch(setAuthIsLoading(true))

            signInWithEmailAndPassword(auth, emailText, passwordText)
                .then(async (userCredential) => {
                    const userData = userCredential.user;
                })
                .catch((error) => {
                    dispatch(setAuthIsLoading(false))
                    const errorMessage = error.message;
                    console.log('ERROR Login', errorMessage)
                    setLoginErrorText(errorMessage)
                });
        } else {
            setIsEmailValidError(true)
        }
    };

    return (
      <AuthLayout title={'Log In'}>

          <InputLayout onFocus={emailOnFocus}>
              <TextInput
                  placeholderTextColor={COLORS.disabled}
                  style={styles.textInput}
                  placeholder="Enter email"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  textContentType="emailAddress"
                  autoFocus={true}
                  value={emailText}
                  onChangeText={(text) => setEmailText(text)}
                  onFocus={() => serEmailOnFocus(true)}
                  onBlur={() => serEmailOnFocus(false)}
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
                  onFocus={() => serPasswordOnFocus(true)}
                  onBlur={() => serPasswordOnFocus(false)}
              />
          </InputLayout>

          <MainBtn
              onPress={Login}
              text={'Log In'}
              isLoading={isLoading}
              disabled={isDisabled}
          />

          <ErrorBlock isErrorMessage={isEmailValidError} message={'Email is not valid'} />

          <ErrorBlock isErrorMessage={loginErrorText} />

          <AddAuthBlock
              text={'Don\'t have an account?'}
              linkText={'Sign Up'}
              onPressLink={() => navigation.navigate("Signup")}
          />
      </AuthLayout>
    );
}
const styles = StyleSheet.create({
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: COLORS.bg,
        borderWidth: 1,
        height: 58,
        marginBottom: 20,
        borderRadius: 10,
        padding: 12,
        width: '100%'
    },
    textInput: {
        fontSize: 16,
        marginRight: 10,
        flex: 10,
        color: COLORS.lightText
    },
});
