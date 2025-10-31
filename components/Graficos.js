import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

export default function Grafico({ registros }) {
  if (registros.length < 2) {
    return <Text style={{textAlign: 'center', margin: 10}}>
      Adicione pelo menos 2 treinos para ver o gráfico.
    </Text>;
  }

  const labels = registros.map(reg => new Date(reg.id).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })).reverse();
  const volumes = registros.map(reg => reg.series * reg.repeticoes * reg.carga).reverse();

  const data = {
    labels,
    datasets: [{ data: volumes }],
  };

  return (
    <View>
      <Text style={{textAlign: 'center', fontWeight: 'bold', fontSize: 16}}>
        Evolução de Volume Total (kg)
      </Text>
      <LineChart
        data={data}
        width={Dimensions.get('window').width - 40}
        height={220}
        yAxisSuffix=" kg"
        chartConfig={{
          backgroundColor: '#1f4e78',
          backgroundGradientFrom: '#3a7bd5',
          backgroundGradientTo: '#00d2ff',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: { borderRadius: 16 },
        }}
        bezier
        style={{ marginVertical: 8, borderRadius: 16 }}
      />
    </View>
  );
}
