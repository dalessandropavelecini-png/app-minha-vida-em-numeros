import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function Formulario({ onSave, onCancel, registroEmEdicao }) {
  const [exercicio, setExercicio] = useState('');
  const [series, setSeries] = useState('');
  const [repeticoes, setRepeticoes] = useState('');
  const [carga, setCarga] = useState('');

  useEffect(() => {
    if (registroEmEdicao) {
      setExercicio(registroEmEdicao.exercicio);
      setSeries(String(registroEmEdicao.series));
      setRepeticoes(String(registroEmEdicao.repeticoes));
      setCarga(String(registroEmEdicao.carga));
    } else {
      setExercicio('');
      setSeries('');
      setRepeticoes('');
      setCarga('');
    }
  }, [registroEmEdicao]);

  const handleSaveClick = () => {
    onSave(exercicio, series, repeticoes, carga);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.subtitulo}>
        {registroEmEdicao ? 'Editando Treino' : 'Novo Treino'}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Nome do exercício"
        value={exercicio}
        onChangeText={setExercicio}
      />
      <TextInput
        style={styles.input}
        placeholder="Séries"
        keyboardType="numeric"
        value={series}
        onChangeText={setSeries}
      />
      <TextInput
        style={styles.input}
        placeholder="Repetições"
        keyboardType="numeric"
        value={repeticoes}
        onChangeText={setRepeticoes}
      />
      <TextInput
        style={styles.input}
        placeholder="Carga (kg)"
        keyboardType="numeric"
        value={carga}
        onChangeText={setCarga}
      />

      <TouchableOpacity style={styles.botao} onPress={handleSaveClick}>
        <Text style={styles.botaoTexto}>
          {registroEmEdicao ? 'Atualizar Treino' : 'Salvar Treino'}
        </Text>
      </TouchableOpacity>

      {registroEmEdicao && (
        <TouchableOpacity style={styles.botaoCancelar} onPress={onCancel}>
          <Text style={styles.botaoTexto}>Cancelar Edição</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: 'white', borderRadius: 8, padding: 15, marginHorizontal: 15, marginBottom: 20, elevation: 3 },
  subtitulo: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, color: '#34495e' },
  input: { borderWidth: 1, borderColor: '#cccccc', borderRadius: 5, padding: 12, fontSize: 16, marginBottom: 10 },
  botao: { backgroundColor: '#3498db', padding: 15, borderRadius: 5, alignItems: 'center', marginTop: 5 },
  botaoTexto: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  botaoCancelar: { backgroundColor: '#7f8c8d', padding: 10, borderRadius: 5, alignItems: 'center', marginTop: 10 },
});
