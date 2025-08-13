class Hello:
    def __init__(self):
        pass
    def sayHello(self,*args,**kwargs):
        return 'Hello World'


class Main:
    def __init__(self,hello:Hello):
        self.hello=hello
    
    def printHello(self,*args,**kwargs):
        print(self.hello.sayHello())


hello=Hello()
main=Main(hello)

main.printHello()