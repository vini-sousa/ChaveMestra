import {Text, View, StyleSheet, Button, Alert,  ActivityIndicator} from 'react-native';
import React, {useEffect, useState } from "react";
import {FontAwesome5} from '@expo/vector-icons'; 
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import DatePicker from 'react-native-date-picker'
import { StatusBar } from 'expo-status-bar';

//component
import Map from '../components/Map'
import { PrivateValueStore } from '@react-navigation/native';

export default function Agendamento(routes){

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [usuario, setUsuario] = useState('');
    const [email, setEmail] = useState('');
    const [usuarioUid, setUsuarioUid] = useState('');

    //datepicker
    const [date, setDate] = useState(new Date)
    const [open, setOpen] = useState()
    const [marcada, setMarcada] = useState(false);


    async function listUsers(){
        const users = await firestore()
        .collection('Usuarios')
        .doc(usuarioUid).get()


        setUsuario(users.data().Nome);
        setEmail(users.data().Email);

        console.log(marcada);
    }

    async function listOfficers(){
        
    }

    function dateFormat(data) {
        if(data){
            const date = new Date(data);
            const day = date.toLocaleDateString('pt-br');
            const hour = date.toLocaleTimeString('pt-BR');
            return `${day}${hour}`;
        }
    }

    
    function verificaData(date, marcada){
        listUsers();
        marcada = false;
        var dataSelecionada = date.toLocaleDateString('pt-br')
        data.forEach(x=> {
            if(dataSelecionada == x){
                setMarcada(true);
                marcada = true;
                firestore()
                .collection('Usuarios')
                .doc(usuarioUid)
                .set({Datas:[x],
                    Nome:usuario,
                    Email:email
                })
                .catch((error => {
                    Alert.alert("Erro ao salvar no banco de dados");
                }))
            }
        });
        if(marcada == true){
                Alert.alert("Seu serviço foi marcado com sucesso");
        }
        if(marcada == false){
            data.forEach(x=>{
                Alert.alert(`Não foi marcado, datas disponíveis:${x}` );
            })
        }
    }

    const getDates = () => {
        firestore()
        .collection('Dates')
        .get()
        .then(function(item){
            item.forEach(x=> {
                setData(x.data().Datas);
            });
        });
    };


    useEffect(()=>{

        auth()
        .onAuthStateChanged(response => {
            if(response != null){
                setUsuarioUid(response.uid);            
            }
            listUsers();
            getDates();
            setLoading(false);
        });
    }, [])

    return(  
        loading == true ? <ActivityIndicator size="large" /> : 
        <View style={{
            height:'100%',
            width:'100%',
            backgroundColor:'#D8BD32',
            alignItems:'center'
        }}>
        <StatusBar
        hidden={true}
        />
            <View style={{
                position:'absolute',
                marginTop:80,
                paddingRight:280
            }}>
                <FontAwesome5 
                    name={routes.route.params.icon} 
                    size={70} 
                    color="black"
                    />
            </View>

            <Text style={{
                    position:'absolute',
                    marginTop:20,
                    fontFamily:'RobotoBold',
                    fontSize: 17,
                    paddingRight:280
            }}>
                Olá, {usuario}
            </Text>

            {<Text
            style={{marginLeft:300,
                    marginTop:20,
                    fontSize:20,
                    fontFamily:'RobotoBold'}}
            >R${routes.route.params.preco}</Text> }

            <View style={style.descricao}> 
                {/* Texto do serviço */}
                <Text style={style.textoh1}>{routes.route.params.nome}</Text>
                {/* descrição do serviço */}
                <Text style={style.textoDescricao}> {routes.route.params.descricao}</Text>
            </View>

            <View style={style.Agendamento}>
                <Button title='Calendario' color={'black'} onPress={() => setOpen(true)}/>
                <DatePicker
                    modal
                    minimumDate={new Date("2022-11-01")}
                    //timeZoneOffsetInMinutes
                    minuteInterval={30}
                    mode='date'
                    open={open}
                    date={date}
                    onConfirm={(date) =>{
                        verificaData(date, marcada);
                        setOpen(false)
                        setDate(date)
                    }}
                    onCancel={() =>{
                        setOpen(false)
                    }}
                />
                { 
                    marcada == true?
                    <View style={{margin:30}}>
                        <Map/>
                    </View> :
                    <View>

                    </View>
                }

            </View>
        </View>
        )
    }


const style = StyleSheet.create({
    Agendamento:{
        margin: 30,
        backgroundColor:'white',
        borderRadius: 9,
        width:'100%',
        height:'100%'   
    },
    Horario:{
        backgroundColor:'#D8BD32',
        height: 125,
        borderRadius: 8,
        width:300,
        margin: 50,
        marginTop: 240
    },
    Horas:{
        height: 70,
        width:74,
        margin: 29,
        borderRadius: 8, 
        alignItems:'center',
        backgroundColor:'#FFFF',
    },
    Minutos:{
        height: 100,
        width:74,
        borderRadius: 8,
        alignItems:'center',
        backgroundColor:'red',
    },
    descricao:{
        padding:5,
        backgroundColor:'#D8BD32',
        height:100,
        width: 210,
        marginLeft: 190,
        marginTop:12,
        borderRadius: 8,
        shadowColor :"#000",
        shadowOffset:{
            width:0,
            height:6,
        },
        shadowOpacity: 0.50,
        shadowRadius:6.38,
        elevation:12
    },
    textoDescricao:{
        fontSize: 10,
        padding: 2,
        fontFamily: 'Roboto',
        alignItems: 'center'
    },
    textoh1:{
        fontFamily:'RobotoBold',
        fontSize:14,
        alignItems: 'center',
        margin: 3
    }
})