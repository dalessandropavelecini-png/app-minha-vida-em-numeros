import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Platform,
  TouchableOpacity,
  Alert,
  Button,
} from 'react-native';
import * as Database from './services/Database';
import Formulario from './components/Formulario';
import ListaRegistros from './components/ListaRegistros';
import Grafico from './components/Graficos';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

export default function App() {
  const [registros, setRegistros] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [ordenacao, setOrdenacao] = useState('recentes');

  useEffect(() => {
    const init = async () => {
      const dados = await Database.carregarDados();
      setRegistros(dados || []);
      setCarregando(false);
    };
    init();
  }, []);

  useEffect(() => {
    if (!carregando) {
      Database.salvarDados(registros);
    }
  }, [registros, carregando]);

  const handleSave = (exercicio, series, repeticoes, carga) => {
    const sNum = parseFloat(String(series).replace(',', '.'));
    const rNum = parseFloat(String(repeticoes).replace(',', '.'));
    const cNum = parseFloat(String(carga).replace(',', '.'));

    if (!exercicio.trim() || [sNum, rNum, cNum].some(v => Number.isNaN(v) || v < 0)) {
      return Alert.alert('Erro', 'Preencha todos os campos corretamente.');
    }

    if (editingId) {
      setRegistros(registros.map(r =>
        r.id === editingId
          ? { ...r, exercicio, series: sNum, repeticoes: rNum, carga: cNum }
          : r
      ));
      Alert.alert('Sucesso', 'Treino atualizado.');
    } else {
      setRegistros([...registros, {
        id: new Date().getTime(),
        data: new Date().toLocaleDateString('pt-BR'),
        exercicio,
        series: sNum,
        repeticoes: rNum,
        carga: cNum,
      }]);
      Alert.alert('Sucesso', 'Treino registrado.');
    }

    setEditingId(null);
  };

  const handleDelete = (id) => {
    setRegistros(registros.filter(r => r.id !== id));
    Alert.alert('Sucesso', 'Treino deletado.');
  };

  const handleEdit = (registro) => {
    setEditingId(registro.id);
  };

  const handleCancel = () => setEditingId(null);

  const exportarDados = async () => {
    const fileUri = Database.fileUri;
    if (Platform.OS === 'web') {
      if (registros.length === 0) return Alert.alert('Aviso', 'Nenhum dado para exportar.');
      const jsonString = JSON.stringify(registros, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'treinos.json';
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      if (!fileInfo.exists) return Alert.alert('Aviso', 'Nenhum dado para exportar.');
      if (!(await Sharing.isAvailableAsync())) return Alert.alert('Erro', 'Compartilhamento indisponível.');
      await Sharing.shareAsync(fileUri);
    }
  };

  if (carregando) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  let registrosExibidos = [...registros];

  if (ordenacao === 'maior_volume') {
    registrosExibidos.sort((a, b) => (b.series * b.repeticoes * b.carga) - (a.series * a.repeticoes * a.carga));
  } else {
    registrosExibidos.sort((a, b) => b.id - a.id);
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.titulo}>📓 Diário de Treinos</Text>
        <Text style={styles.subtituloApp}>Registre e acompanhe sua evolução</Text>

        <Formulario
          onSave={handleSave}
          onCancel={handleCancel}
          registroEmEdicao={registros.find(r => r.id === editingId) || null}
        />

        {/* 📊 Botões de ordenação */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 10, gap: 10 }}>
          <Button title="Mais Recentes" onPress={() => setOrdenacao('recentes')} />
          <Button title="Maior Volume" onPress={() => setOrdenacao('maior_volume')} />
        </View>

        {/* 📈 Gráfico */}
        <View style={styles.card}>
          <Grafico registros={registros} />
        </View>

        {/* 📋 Lista de treinos */}
        <ListaRegistros
          registros={registrosExibidos}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {/* 📤 Exportação */}
        <View style={styles.card}>
          <Text style={styles.subtitulo}>Exportar Dados</Text>
          <TouchableOpacity style={styles.botaoExportar} onPress={exportarDados}>
            <Text style={styles.botaoTexto}>Exportar arquivo JSON</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: Platform.OS === 'android' ? 25 : 0, backgroundColor: '#f0f4f7' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  titulo: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginVertical: 20, color: '#1e3a5f' },
  subtituloApp: { textAlign: 'center', fontSize: 16, color: '#555', marginTop: -20, marginBottom: 20, fontStyle: 'italic' },
  card: { backgroundColor: 'white', borderRadius: 8, padding: 15, marginHorizontal: 15, marginBottom: 20, elevation: 3 },
  subtitulo: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, color: '#34495e' },
  botaoExportar: { backgroundColor: '#27ae60', padding: 15, borderRadius: 5, alignItems: 'center', marginTop: 5 },
  botaoTexto: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});
