<?php

namespace Teo\CoreBundle\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class DefaultControllerTest extends WebTestCase
{
    public function testIndex()
    {
        $client = static::createClient();

        $crawler = $client->request('GET', '/');

        // $this->assertTrue($crawler->filter('html:contains("Teo")')->count() > 0);
    }
}
