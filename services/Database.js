import * as FileSystem from 'expo-file-system';

const fileUri = FileSystem.documentDirectory + 'dados.json';

// 📥 Salvar dados no arquivo
export async function salvarDados(dados) {
  try {
    const jsonValue = JSON.stringify(dados);
    await FileSystem.writeAsStringAsync(fileUri, jsonValue);
    console.log('✅ Dados salvos com sucesso');
  } catch (error) {
    console.log('❌ Erro ao salvar dados:', error);
  }
}

// 📤 Carregar dados do arquivo
export async function carregarDados() {
  try {
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    if (!fileInfo.exists) {
      return [];
    }

    const jsonValue = await FileSystem.readAsStringAsync(fileUri);
    return JSON.parse(jsonValue);
  } catch (error) {
    console.log('❌ Erro ao carregar dados:', error);
    return [];
  }
}

// 🧼 Apagar dados (opcional)
export async function limparDados() {
  try {
    await FileSystem.deleteAsync(fileUri);
    console.log('🧹 Dados apagados com sucesso');
  } catch (error) {
    console.log('❌ Erro ao apagar dados:', error);
  }
}
