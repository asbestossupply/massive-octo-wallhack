// @barge suite:'casper'

casper.test.begin('Barge homepage loads', 2, function suite(test) {
    casper.start("http://www.bargeapp.com/", function() {
        test.assertTitle("Barge", "homepage title is Barge");
        test.assertExists('a[href="http://meta.bargeapp.com"]', "blog link is found");
        test.assertTrue(false, "true is not false!")
    });


    casper.run(function() {
        test.done();
    });
});
