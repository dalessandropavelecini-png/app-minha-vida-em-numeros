import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function ListaRegistros({ registros, onEdit, onDelete }) {
  return (
    <View style={styles.card}>
      <Text style={styles.subtitulo}>Histórico de Treinos</Text>
      {registros.length > 0 ? [...registros].reverse().map(reg => (
        <View key={reg.id} style={styles.itemHistorico}>
          <Text style={styles.itemTexto}>
            🏋️ {reg.exercicio} — {reg.series}x{reg.repeticoes} | {reg.carga} kg | Volume: {reg.series * reg.repeticoes * reg.carga} kg
          </Text>
          <View style={styles.botoesAcao}>
            <TouchableOpacity style={styles.botaoEditar} onPress={() => onEdit(reg)}>
              <Text style={styles.botaoTextoAcao}>✎</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.botaoDelete} onPress={() => onDelete(reg.id)}>
              <Text style={styles.botaoTextoAcao}>X</Text>
            </TouchableOpacity>
          </View>
        </View>
      )) : (
        <Text style={styles.itemTexto}>Nenhum treino registrado.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: 'white', borderRadius: 8, padding: 15, marginHorizontal: 15, marginBottom: 20, elevation: 3 },
  subtitulo: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, color: '#34495e' },
  itemHistorico: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderColor: '#eee' },
  itemTexto: { fontSize: 16, color: '#333', flex: 1, marginRight: 10 },
  botoesAcao: { flexDirection: 'row' },
  botaoEditar: { backgroundColor: '#f39c12', borderRadius: 15, width: 30, height: 30, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  botaoDelete: { backgroundColor: '#e74c3c', borderRadius: 15, width: 30, height: 30, justifyContent: 'center', alignItems: 'center' },
  botaoTextoAcao: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});
