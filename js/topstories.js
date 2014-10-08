(function(){
    var HNFirebase = new Firebase("http://hacker-news.firebaseio.com/v0/");
    var stories = [];
    HNFirebase.child('topstories').once('value', function(snapshot){
        var entries = snapshot.val();
        var callback = _.after(entries.length, handleEntries);
        entries.forEach(function(item){
            HNFirebase.child('item/'+item).once('value', function(snapshot){
                stories.push(snapshot.val());
                callback();
            });
        });    
    });
    
    function handleEntries(){
        console.log('Got', stories.length, 'stories');
        //sort by score desc
        stories = _.sortBy(stories, sortCriterias);
        var html = '';
        _.each(stories, function(entry){
             html += getEntryHTML(entry);
        });
        document.getElementById('stories').innerHTML = html;
        document.getElementById('loading').className = 'hidden';
        document.getElementById('stories').className = '';
    }
    function sortCriterias(entry){
        return - entry.score;
    }
    function getEntryHTML(entry){
        console.log(entry);
        return '<div class="entry"><a target="_blank" href="'+entry.url+'"><div class="score">'+entry.score+'</div><div class="title">'+entry.title+'</div><div class="author">'+entry.by+'</div><div class="date">'+getEntryDateString(entry)+'</div></div>'
    }
    function getEntryDateString(entry){
        var date= new Date(entry.time*1000);
        return date.toLocaleDateString()+' '+date.toLocaleTimeString();
    }
})();