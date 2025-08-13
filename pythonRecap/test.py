def createFile()->None:
    file_name:str|None=None
    try:
        file_name=input('Type Your File Name : ')
        if file_name==None:
            print('File Name Not Provided')
        open(f'{file_name}.py','x')
    except:
        print('File Creation Failed')
    finally:
        print(f'{file_name} File Created Successfully')

createFile()

