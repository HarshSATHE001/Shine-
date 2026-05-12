import pandas as pd
import random

def generate_test_data_xlsx(num_students=50):
    schools = ['GP', 'MS']
    sexes = ['F', 'M']
    addresses = ['U', 'R']
    famsizes = ['GT3', 'LE3']
    pstatuses = ['T', 'A']
    jobs = ['teacher', 'health', 'services', 'at_home', 'other']
    reasons = ['home', 'reputation', 'course', 'other']
    guardians = ['mother', 'father', 'other']
    binary = ['yes', 'no']
    courses = ['math', 'portuguese']

    data = []

    for i in range(num_students):
        student = {
            "school": random.choice(schools),
            "sex": random.choice(sexes),
            "age": random.randint(15, 22),
            "address": random.choice(addresses),
            "famsize": random.choice(famsizes),
            "Pstatus": random.choice(pstatuses),
            "Medu": random.randint(0, 4),
            "Fedu": random.randint(0, 4),
            "Mjob": random.choice(jobs),
            "Fjob": random.choice(jobs),
            "reason": random.choice(reasons),
            "guardian": random.choice(guardians),
            "traveltime": random.randint(1, 4),
            "studytime": random.randint(1, 4),
            "failures": random.randint(0, 3),
            "schoolsup": random.choice(binary),
            "famsup": random.choice(binary),
            "paid": random.choice(binary),
            "activities": random.choice(binary),
            "nursery": random.choice(binary),
            "higher": random.choice(binary),
            "internet": random.choice(binary),
            "romantic": random.choice(binary),
            "famrel": random.randint(1, 5),
            "freetime": random.randint(1, 5),
            "goout": random.randint(1, 5),
            "Dalc": random.randint(1, 5),
            "Walc": random.randint(1, 5),
            "health": random.randint(1, 5),
            "absences": random.randint(0, 30),
            "course": random.choice(courses)
        }
        data.append(student)

    df = pd.DataFrame(data)
    df.to_excel('test_students_50.xlsx', index=False)
    print(f"Generated 50 test students in test_students_50.xlsx")

if __name__ == "__main__":
    generate_test_data_xlsx()
