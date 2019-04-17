const env = process.env.NODE_ENV || 'dev';

const config =()=>{
    switch(env){
        case 'dev':
        return{
            bd_string:'mongodb+srv://mad_user:Myworld7@clusterfirstapi-drkri.mongodb.net/test?retryWrites=true',
            jwt_pass:'poorpassword',
            jwt_expires_in:'2d',
            sv_port:'3000'

        }
        case 'hml':
        return{
            bd_string:''

        }
        case 'prod':
        return{
            bd_string:''

        }
    }
}

console.log('Iniciando a API em ambiente '+env.toUpperCase());

module.exports = config();