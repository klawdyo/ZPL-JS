const {commands} = require('./commands')

 const zpl = {
  list : [],
   
  /**
   * Cria os comandos e os adiciona ao 
   *
   */
  command(key, ...params){
    //console.log(params)
    this.list.push(this.getCommand(key, params))
    return this;
  },

   /**
    * Concentra a criação dos comandos
    *
    */
  getCommand(key, params){
    //console.log('getcomand params', key, params)
    const cmd = commands[key]
    let values = []
    if(cmd.parameters){
      cmd.parameters.forEach((param,i) => {
        //console.log('avali', param, 'valor:', params[i])
        let value = params[i]

        // Se é obrigatório e foi preenchido, ok
        // Se é obrigatório, não foi preenchido mas possui um valor padrão, 
        // use o valor padrão. Se não, retorne um erro
        if(param.required && !value){
          if(param.default) value = param.default
          else throw new Error(`Error on command ${key}, param ${param.name} (${param.description}). Param is required.` )
        } else if(value){

           // Se o formato não casar
          if(param.regex && !param.regex.test(value)){
            throw new Error(`Format validation error on command ${key}, param ${param.name} (${param.description})` )
          }
  
          // Se a validação não passar
          if(param.validation && !param.validation(value)){
            throw new Error(`Validation error on command ${key}, param ${param.name} (${param.description})` )
          }     
        }

        
        
    

        // Se chegou até aqui, adicione o valor à lista
        //console.log('values antes d push', value)
        if(value)values.push(value)
        
      })
      
    }

    
    return {
      key,
      start: cmd.start,
      end: cmd.end,
      values,
      breakLine: cmd.breakLine
    }
  },

  getCommandString(item){
    console.log(item)
    let br;
    if (!item.breakLine) br=' ' 
    else
      br = `
`
    return `${item.start}${item.values ? item.values.join(',') : item.values}${item.end??''}${br}`
  },

  /**
   *
   *
   *
   */
  toString(){
    //console.log(this.list)
    const list = [
      this.getCommand('START'),
      ...this.list,
      this.getCommand('END')
    ]
    //console.log(list)
    return list.map(item => this.getCommandString(item))
      .join(`
`)
  }
}

module.exports = zpl