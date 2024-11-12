import json
import matplotlib.pyplot as plt

with open('data.json') as f:
    data = json.load(f)


x = data['x']
y = data['y']

print(f"Lunghezza di x: {len(x)}")
print(f"Lunghezza di y: {len(y)}")

plt.scatter(x, y)
plt.plot(x, y)
plt.xlabel('Invio Rate (1/avgSendingTime)')
plt.ylabel('Tempo di risposta (ms))')
plt.title('Grafico delle prestazioni')

plt.show()