class Queue{
    constructor(){
        this.items = [];
    }
    add(element){    
        this.items.push(element);
    }
    pop(){
        if(this.empty()) return;
        return this.items.shift();
    }
    front(){
        if(this.empty()) return;
        return this.items[0];
    }
    empty(){
        return this.items.length == 0;
    }
}

class Stack{
    constructor(){
        this.items = [];
    }
    add(element){    
        this.items.push(element);
    }
    pop(){
        if(this.empty()) return;
        return this.items.pop();
    }
    front(){
        if(this.empty()) return;
        return this.items[this.items.length-1];
    }
    empty(){
        return this.items.length == 0;
    }
}