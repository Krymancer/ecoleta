import React, { useState, useEffect, ChangeEvent } from 'react';
import { StyleSheet, ImageBackground, View, Image, Text } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { Feather as Icon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';


interface IBGEUFResponse {
  sigla: string;
}

interface IBGECityResponse {
  nome: string;
}

interface UFS {
  label: string;
  value: string;
}

interface Cities {
  label: string;
  value: string;
}

const Home = () => {
  const [ufs, setUfs] = useState<UFS[]>([]);
  const [cities, setCities] = useState<Cities[]>([]);

  const [selectedUf, setSelectedUf] = useState('0');
  const [selectedCity, setSelectedCity] = useState('0');

  const navigation = useNavigation();

  useEffect(() => {
    axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
      const ufInitials = response.data.map(uf => ({ label: uf.sigla, value: uf.sigla }));
      setUfs(ufInitials);
    });
  }, []);

  useEffect(() => {

    if (selectedUf === '0') return;

    axios
      .get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
      .then(response => {
        const cityNames = response.data.map(city => ({ label: city.nome, value: city.nome }));
        setCities(cityNames);

      });
  }, [selectedUf]);

  function handeNavigateToPoints() {
    navigation.navigate('Points', { uf: selectedUf, city: selectedCity});
  }

  function handleSelectUf(event: string) {
    const uf = event;
    setSelectedUf(uf);
  }

  function handleSelectCity(event: string) {
    const city = event;
    setSelectedCity(city);
  }

  return (
    <ImageBackground
      source={require('../../assets/home-background.png')}
      style={styles.container}
      imageStyle={{ width: 274, height: 368 }}
    >
      <View style={styles.main}>
        <Image source={require('../../assets/logo.png')} />
        <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
        <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente</Text>
      </View>

      <View style={styles.footer}>

          <RNPickerSelect
            onValueChange={handleSelectUf}
            value={selectedUf}
            placeholder={{ label: "Selecione uma UF", value: '0' }}
            items={ufs}
          />

          <RNPickerSelect
            onValueChange={handleSelectCity}
            placeholder={{ label: "Selecione uma cidade", value: '0' }}
            value={selectedCity}
            items={cities}
          />
      


        <RectButton style={styles.button} onPress={handeNavigateToPoints}>
          <View style={styles.buttonIcon}>
            <Icon name="arrow-right" color="#fff" size={24} />
          </View>
          <Text style={styles.buttonText}>
            Entrar
          </Text>
        </RectButton>
      </View>

    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  inputContainer: {
    paddingBottom: 20,
    color: '#6C6C80',
  },

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  }
});

export default Home;