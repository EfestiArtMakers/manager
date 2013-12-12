/**
 * Created by riccardo on 29/11/13.
 */

exports.deploy = function(req, res){
    res.render('deploy', { title: 'Deploy Tools - Efesti srl' });
};

exports.login = function(req, res){
    res.render('login', { title: 'Login Page' });
};