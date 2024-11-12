import subprocess
import time
from concurrent.futures import ThreadPoolExecutor
import threading
import json

total_response_time = 0
total_time_to_send = 0  
lock = threading.Lock()

def run_upload_task():
    global total_response_time, total_time_to_send

    
    sending_time = time.time()
    
    
    process = subprocess.Popen(['npx', 'hardhat', 'uploadRandom', '100'], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    
    sent_time = time.time()
    
    time_to_send = (sent_time - sending_time) * 1000

    print(f"Tempo di invio della richiesta: {time_to_send:.2f} ms")

    process.communicate() #Aspetta il completamento dello script

    end_time = time.time()
    
    response_time = (end_time - sending_time) * 1000

    print(f"Tempo di risposta: {response_time:.2f} ms")

    with lock:
        total_response_time += response_time
        total_time_to_send += time_to_send

def execute_in_parallel(num_executions):

    with ThreadPoolExecutor(max_workers=num_executions) as executor:
        threads = [executor.submit(run_upload_task) for _ in range(num_executions)]
        for thread in threads:
            thread.result() 


if __name__ == "__main__":

    data = {"x":[], "y":[]}
    for i in range(0, 5):

        num_executions = 100
        execute_in_parallel(num_executions)
        avg_time_to_send = total_time_to_send / num_executions
        avg_response_time = total_response_time / num_executions
        avg_sending_rate = 1/avg_time_to_send
        print(f"Tempo medio di invio: {avg_time_to_send:.2f} ms")
        print(f"Tempo medio di risposta: {avg_response_time:.2f} ms")
        data["x"].append(avg_sending_rate)
        data["y"].append(avg_response_time)
        total_response_time = 0
        total_time_to_send = 0  

    with open("data.json", "w") as json_file:
        json.dump(data, json_file, indent=4)