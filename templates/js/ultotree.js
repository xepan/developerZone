$.each({
    makeTree : function(){
         $('#'+this.jquery.attr('id') +' li > ul').each(function(i) {
            // Find this list's parent list item.
            var parent_li = $(this).parent('li');

            // Style the list item as folder.
            parent_li.addClass('folder');

            // Temporarily remove the list from the
            // parent list item, wrap the remaining
            // text in an anchor, then reattach it.
            var sub_ul = $(this);
            parent_li.wrapInner('<a/>').find('a').click(function() {
                // Make the anchor toggle the leaf display.
                sub_ul.toggle();
            });
            parent_li.append(sub_ul);
        });
        // Hide all lists except the outermost.
        $('#'+this.jquery.attr('id') +' ul ul').hide();
    }
}, $.univ._import);