import json
import matplotlib.pyplot as plt

with open('data.json') as f:
    data = json.load(f)


x = data['x']
x_s = [i * 1000.0 for i in x]
y = data['y']
y_s = [i / 1000.0 for i in y]

print(f"Lunghezza di x: {len(x)}")
print(f"Lunghezza di y: {len(y)}")

plt.scatter(x_s, y_s)
plt.plot(x_s, y_s)
plt.xlabel('Rate di invio (req/s)')
plt.ylabel('Tempo di risposta (s)')
plt.title('Grafico delle prestazioni')

plt.show()