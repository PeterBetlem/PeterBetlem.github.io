export function loadSidebarPages () {
        $( "#home" ).load( "./pages/home.html" );
        $( "#projects" ).load( "./pages/projects.html" );
        $( "#contact" ).load( "./pages/contact.html" );
        $( "#teaching" ).load( "./pages/teaching.html" );
        $( "#events" ).load( "./pages/events.html" );
        $( "#grants" ).load( "./pages/grants.html" )
//       $( "#publications" ).load( "./pages/publications.html" ); // automatically refreshed.
}
