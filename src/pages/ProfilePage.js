import {
    Button,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import React, {useLayoutEffect, useMemo, useState} from "react";
import {COLORS} from "../helpers/colors";
import {AntDesign, MaterialIcons} from "@expo/vector-icons";
import {useNavigation} from "@react-navigation/native";
import {useDispatch, useSelector} from "react-redux";
import {auth, db} from "../../config/firebase";
import {USER_LOGOUT} from "../store";
import {MainBtn} from "../components/MainBtn";
import {updateProfile} from "firebase/auth";
import {setCurrentUser} from "../store/auth/authSlice";
import {deleteUser, getAuth, signOut, reauthenticateWithCredential, EmailAuthProvider} from "firebase/auth";
import {equalTo, get, orderByChild, query, ref, remove, update} from "firebase/database";
import {InputLayout} from "../lauouts/InputLayout";
import {TextBtn} from "../components/TextBtn";

export const ProfilePage = () => {
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const { currentUser } = useSelector(state => state.auth)

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: () => <Text
                style={{ color: COLORS.primary, fontSize: 16, fontWeight: "bold"}}
            >{currentUser ? currentUser.displayName : 'Profile'}</Text>,
        });
    }, [navigation, currentUser]);

    //logout
    const onSignOut = () => {
        signOut(auth).then( async () => {
            console.log('User sing out success')
            dispatch({type: USER_LOGOUT})

            navigation.navigate('Todo')

        }).catch((error) => {
            console.log('Error logging out: ', error)
        });
    };

    //Edit profile
    const [showModal, setShowModal] = useState(false);
    const [nickname, setNickname] = useState(currentUser ? currentUser.displayName: '');
    const isBtnDisabled = useMemo(() => {
        return !nickname.trim() || (currentUser && currentUser.displayName === nickname)
    }, [nickname])
    const [nicknameOnFocus, setNicknameOnFocus] = useState(false)
    const [isLoadingEdit, setIsLoadingEdit] = useState(false)
    const [isErrorEdit, setIsErrorEdit] = useState('')
    const editProfile = () => {
        setIsLoadingEdit(true)
        updateProfile(auth.currentUser, {
            displayName: nickname,
        })
            .then(() => {
                const updatedUser = auth.currentUser;
                const userData = {
                    email: updatedUser.email,
                    displayName: nickname,
                    uid: updatedUser.uid,
                }
                dispatch(setCurrentUser(userData))
                setIsLoadingEdit(false)
                setShowModal(false)

            })
            .catch((error) => {
                setIsErrorEdit(error.message)
                console.error('Error updating user profile', error.message);
                setIsLoadingEdit(false)
            });
    }


    const [showModalDelete, setShowModalDelete] = useState(false);
    const [passwordIsSecure, setPasswordIsSecure] = useState(true)
    const [password, setPassword] = useState('');

    const [isDeleteLoading, setIsDeleteLoading] = useState(false)
    const [isDeleteError, setIsDeleteError] = useState(false)

    const deleteUserAccount = async () => {
        setIsDeleteLoading(true)
        try {
            const auth = getAuth();
            const user = auth.currentUser;

            const credential = EmailAuthProvider.credential(user.email, password);

            await reauthenticateWithCredential(user, credential);
            console.log('User re-authenticated successfully.');


            await deleteUser(user);
            console.log(`User ${user.uid} successfully deleted.`);


            const notesRef = ref(db, 'notes');
            const notesToDeleteRef = query(notesRef, orderByChild('creatorId'), equalTo(currentUser.uid));

            const snapshot = await get(notesToDeleteRef);

            if (snapshot.val()) {
                for (const [childSnapshotKey, childSnapshot] of Object.entries(snapshot.val())) {
                    // Delete notes
                    await remove(ref(db, `notes/${childSnapshotKey}`));
                    console.log(`Note with ID:${childSnapshotKey} successfully deleted.`);
                }
            }

            console.log(`User data and notes successfully deleted.`);
            setIsDeleteLoading(false);

            dispatch({type: USER_LOGOUT})

            navigation.navigate('Todo')
        } catch (error) {
            console.error(`Error deleting user account: ${error.message}`);
            setIsDeleteError(`Error deleting user account: ${error.message}`);
            setIsDeleteLoading(false);
        }
    };


    return (
        <View style={styles.wrapper}>

            {/*Edit modal*/}
            <Modal visible={showModal} animationType="slide" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Name</Text>

                        <InputLayout>
                            <TextInput
                                placeholderTextColor={COLORS.disabled}
                                style={styles.input}
                                placeholder="Enter nickname"
                                value={nickname}
                                onChangeText={(text) => setNickname(text)}
                                onFocus={() => setNicknameOnFocus(true)}
                                onBlur={() => setNicknameOnFocus(false)}
                            />
                        </InputLayout>


                        <View style={styles.modalBtnWrapper} >
                            <MainBtn
                                onPress={editProfile}
                                text={'Save'}
                                isLoading={isLoadingEdit}
                                disabled={isBtnDisabled}
                            />

                            {
                                isErrorEdit &&
                                <Text style={{color: 'red'}}>{isErrorEdit}</Text>
                            }


                            <TextBtn
                                color={COLORS.lightText}
                                title={'Cancel'}
                                onPress={() => setShowModal(false)}
                            />
                        </View>


                    </View>
                </View>
            </Modal>


            {/*Delete account modal*/}

            <Modal visible={showModalDelete} animationType="slide" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={{
                            fontSize: 18,
                            fontWeight: 'bold',
                            marginBottom: 10,
                            textAlign: 'center',
                            color: COLORS.lightText
                        }}>Confirmation of profile deletion.</Text>
                        <Text style={{textAlign: 'center', color: COLORS.lightText, marginBottom: 10}}>Are you sure you want to delete your profile? As a result of deleting the profile, all data related to it will be permanently deleted.</Text>

                        <InputLayout>
                            <TextInput
                                style={{...styles.input}}
                                placeholderTextColor={'gray'}
                                placeholder="Enter password"
                                textContentType="password"
                                value={password}
                                onChangeText={(text) => setPassword(text)}
                            />
                        </InputLayout>

                        <View style={styles.modalBtnWrapper} >
                            <MainBtn
                                onPress={deleteUserAccount}
                                text={'Delete'}
                                isLoading={isDeleteLoading}
                                disabled={!password.trim() || password.length < 6}
                            />

                            {
                                isDeleteError &&
                                <Text style={{color: 'red'}}>{isDeleteError}</Text>
                            }


                            <TextBtn
                                color={COLORS.lightText}
                                title={'Cancel'}
                                onPress={() => setShowModalDelete(false)}
                            />
                        </View>

                    </View>
                </View>
            </Modal>


            <Text style={styles.title}>Profile</Text>

            {
                currentUser &&
                <View style={styles.credentialsWrapper}>
                    <Text style={styles.name}>{currentUser.displayName}</Text>
                    <Text style={styles.email}>{currentUser.email}</Text>
                </View>
            }


            <View style={styles.settingsWrapper}>
                <TouchableOpacity onPress={() => setShowModal(true)} style={styles.settingItem}>
                    <Text style={styles.settingItemText}>Edit Profile</Text>
                    <MaterialIcons name="navigate-next" size={40} color={COLORS.primary} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setShowModalDelete(true)} style={styles.settingItem}>
                    <Text style={styles.settingItemTextDelete}>Delete Account</Text>
                    <MaterialIcons name="navigate-next" size={40} color={COLORS.primary} />
                </TouchableOpacity>

                <TouchableOpacity onPress={onSignOut} style={styles.settingItem}>
                    <Text style={styles.settingItemTextLogout}>Logout</Text>
                    <MaterialIcons name="navigate-next" size={40} color={COLORS.primary} />
                </TouchableOpacity>

            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        paddingTop: 20,
        flex: 1,
        backgroundColor: COLORS.bg,
        paddingHorizontal: 20
    },
    title: {
        fontSize: 36,
        color: COLORS.lightText,
        fontWeight: 'bold'
    },
    credentialsWrapper: {
        flex: 1,
        // backgroundColor: 'red',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderColor: COLORS.primary
    },
    name: {
        color: COLORS.primary,
        fontSize: 42,
        fontWeight: 'bold',
        marginBottom: 10
    },
    email: {
        color: COLORS.lightText,
        fontSize: 20
    },

    settingsWrapper: {
        flex: 2,
        padding: 20
        // backgroundColor: 'blue'
    },

    settingItem: {
        paddingVertical: 15,
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderColor: COLORS.lightText,
        marginBottom: 20
    },
    settingItemText: {
        color: COLORS.lightText,
        fontSize: 22,
        fontWeight: "bold"
    },

    settingItemTextDelete: {
        color: 'red',
        fontSize: 22,
        fontWeight: "bold"
    },

    settingItemTextLogout: {
        color: COLORS.primary,
        fontSize: 22,
        fontWeight: "bold"
    },

    //modal

    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: COLORS.lightBg,
        borderWidth: 2,
        borderColor: COLORS.primary,
        padding: 20,
        borderRadius: 20,
        width: '80%',
        alignItems: 'center',
    },
    modalBtnWrapper: {
        width: '100%',
        // flexDirection: 'row',
        // alignItems: 'center',
        // justifyContent: "space-between",
        gap: 20,
        marginTop: 10
    },

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
    input: {
        fontSize: 16,
        marginRight: 10,
        flex: 10,
        color: COLORS.lightText
    },
    icon: {
        flex: 1
    },

    modalTitle: {
        color: COLORS.primary,
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 15
    }
})
